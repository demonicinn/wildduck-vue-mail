'use strict';

const config = require('wild-config');
const restify = require('restify');
const log = require('npmlog');
const logger = require('restify-logger');
const UserHandler = require('./lib/user-handler');
const MailboxHandler = require('./lib/mailbox-handler');
const MessageHandler = require('./lib/message-handler');
const ImapNotifier = require('./lib/imap-notifier');
const db = require('./lib/db');
const certs = require('./lib/certs');
const tools = require('./lib/tools');
const crypto = require('crypto');
const Gelf = require('gelf');
const os = require('os');
const util = require('util');

const usersRoutes = require('./lib/api/users');
const addressesRoutes = require('./lib/api/addresses');
const mailboxesRoutes = require('./lib/api/mailboxes');
const messagesRoutes = require('./lib/api/messages');
const filtersRoutes = require('./lib/api/filters');
const aspsRoutes = require('./lib/api/asps');
const totpRoutes = require('./lib/api/2fa/totp');
const custom2faRoutes = require('./lib/api/2fa/custom');
const u2fRoutes = require('./lib/api/2fa/u2f');
const updatesRoutes = require('./lib/api/updates');
const authRoutes = require('./lib/api/auth');
const autoreplyRoutes = require('./lib/api/autoreply');
const submitRoutes = require('./lib/api/submit');
const domainaliasRoutes = require('./lib/api/domainaliases');
const dkimRoutes = require('./lib/api/dkim');

let userHandler;
let mailboxHandler;
let messageHandler;
let notifier;
let loggelf;

const serverOptions = {
    name: 'WildDuck API',
    strictRouting: true,
    maxParamLength: 196,
    formatters: {
        'application/json; q=0.4': (req, res, body) => {
            let data = body ? JSON.stringify(body, false, 2) + '\n' : 'null';
            let size = Buffer.byteLength(data);
            res.setHeader('Content-Length', size);
            if (!body) {
                return data;
            }

            let path = (req.route && req.route.path) || (req.url || '').replace(/(accessToken=)[^&]+/, '$1xxxxxx');

            let message = {
                short_message: 'HTTP [' + req.method + ' ' + path + '] ' + (body.success ? 'OK' : 'FAILED'),

                _ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                _client_ip: ((req.body && req.body.ip) || (req.query && req.query.ip) || '').toString().substr(0, 40) || '',

                _http_route: path,
                _http_method: req.method,
                _user: req.user,
                _role: req.role,

                _api_response: body.success ? 'success' : 'fail',

                _error: body.error,
                _code: body.code,

                _size: size
            };

            Object.keys(req.params || {}).forEach(key => {
                let value =
                    typeof req.params[key] === 'string'
                        ? req.params[key]
                        : util
                              .inspect(req.params[key], false, 3)
                              .toString()
                              .trim();

                if (!value) {
                    return;
                }

                if (['password'].includes(key)) {
                    value = '***';
                } else if (value.length > 128) {
                    value = value.substr(0, 128) + '…';
                }

                if (key.length > 30) {
                    key = key.substr(0, 30) + '…';
                }

                message['_req_' + key] = value;
            });

            Object.keys(body).forEach(key => {
                let value = body[key];
                if (!body || !['id'].includes(key)) {
                    return;
                }
                value =
                    typeof value === 'string'
                        ? value
                        : util
                              .inspect(value, false, 3)
                              .toString()
                              .trim();

                if (value.length > 128) {
                    value = value.substr(0, 128) + '…';
                }

                if (key.length > 30) {
                    key = key.substr(0, 30) + '…';
                }

                message['_res_' + key] = value;
            });

            loggelf(message);

            return data;
        }
    }
};

let certOptions = {};
certs.loadTLSOptions(certOptions, 'api');

if (config.api.secure && certOptions.key) {
    serverOptions.key = certOptions.key;
    if (certOptions.ca) {
        serverOptions.ca = certOptions.ca;
    }
    serverOptions.certificate = certOptions.cert;
}

const server = restify.createServer(serverOptions);

// disable compression for EventSource response
// this needs to be called before gzipResponse
server.use((req, res, next) => {
    if (req.route.path === '/users/:user/updates') {
        req.headers['accept-encoding'] = '';
    }
    next();
});

server.use(restify.plugins.gzipResponse());

server.use(restify.plugins.queryParser());
server.use(
    restify.plugins.bodyParser({
        maxBodySize: 0,
        mapParams: true,
        mapFiles: false,
        overrideParams: false
    })
);

server.use(
    tools.asyncifyJson(async (req, res, next) => {
        let accessToken = req.query.accessToken || req.headers['x-access-token'] || false;

        if (req.query.accessToken) {
            // delete or it will conflict with Joi schemes
            delete req.query.accessToken;
        }

        if (req.headers['x-access-token']) {
            req.headers['x-access-token'] = '';
        }

        let tokenRequired = false;

        let fail = () => {
            res.status(403);
            res.charSet('utf-8');
            return res.json({
                error: 'Invalid accessToken value',
                code: 'InvalidToken'
            });
        };

        req.validate = permission => {
            if (!permission.granted) {
                let err = new Error('Not enough privileges');
                err.responseCode = 403;
                err.code = 'MissingPrivileges';
                throw err;
            }
        };

        // hard coded master token
        if (config.api.accessToken) {
            tokenRequired = true;
            if (config.api.accessToken === accessToken) {
                req.role = 'root';
                req.user = 'root';
                return next();
            }
        }

        if (config.api.accessControl.enabled || accessToken) {
            tokenRequired = true;
            if (accessToken && accessToken.length === 40 && /^[a-fA-F0-9]{40}$/.test(accessToken)) {
                let tokenData;
                let tokenHash = crypto
                    .createHash('sha256')
                    .update(accessToken)
                    .digest('hex');

                try {
                    let key = 'tn:token:' + tokenHash;
                    tokenData = await db.redis.hgetall(key);
                } catch (err) {
                    err.responseCode = 500;
                    err.code = 'InternalDatabaseError';
                    throw err;
                }

                if (tokenData && tokenData.user && tokenData.role && config.api.roles[tokenData.role]) {
                    let signature = crypto
                        .createHmac('sha256', config.api.accessControl.secret)
                        .update(
                            JSON.stringify({
                                token: accessToken,
                                user: tokenData.user,
                                role: tokenData.role
                            })
                        )
                        .digest('hex');

                    if (signature !== tokenData.s) {
                        // rogue token
                        try {
                            await db.redis
                                .multi()
                                .del('tn:token:' + tokenHash)
                                .srem('tn:user:' + tokenData.user, tokenHash)
                                .exec();
                        } catch (err) {
                            // ignore
                        }
                    } else if (tokenData.ttl && isNaN(tokenData.ttl) && Number(tokenData.ttl) > 0) {
                        let tokenTTL = Number(tokenData.ttl);
                        let tokenLifetime = config.api.accessControl.tokenLifetime || 30 * 24 * 3600;

                        // check if token is not too old
                        if (tokenLifetime < (Date.now() - Number(tokenData.created)) / 1000) {
                            // token is still usable, increase session length
                            try {
                                await db.redis
                                    .multi()
                                    .expire('tn:token:' + tokenHash, tokenTTL)
                                    .expire('tn:user:' + tokenData.user, tokenTTL)
                                    .exec();
                            } catch (err) {
                                // ignore
                            }
                            req.role = tokenData.role;
                            req.user = tokenData.user;
                        }
                    } else {
                        req.role = tokenData.role;
                        req.user = tokenData.user;
                    }

                    if (req.params && req.params.user === 'me' && /^[0-9a-f]{24}$/i.test(req.user)) {
                        req.params.user = req.user;
                    }

                    return next();
                }
            }
        }

        if (tokenRequired) {
            // no valid token found
            return fail();
        }

        // allow all
        req.role = 'root';
        req.user = 'root';
        next();
    })
);

logger.token('user-ip', req => ((req.body && req.body.ip) || (req.query && req.query.ip) || '').toString().substr(0, 40) || '-');
logger.token('user-sess', req => (req.body && req.body.sess) || (req.query && req.query.sess) || '-');

logger.token('user', req => (req.user && req.user.toString()) || '-');
logger.token('url', req => {
    if (/\baccessToken=/.test(req.url)) {
        return req.url.replace(/\baccessToken=[^&]+/g, 'accessToken=' + 'x'.repeat(6));
    }
    return req.url;
});

server.use(
    logger(':remote-addr :user [:user-ip/:user-sess] :method :url :status :time-spent :append', {
        stream: {
            write: message => {
                message = (message || '').toString();
                if (message) {
                    log.http('API', message.replace('\n', '').trim());
                }
            }
        }
    })
);

module.exports = done => {
    if (!config.api.enabled) {
        return setImmediate(() => done(null, false));
    }

    let started = false;

    const component = config.log.gelf.component || 'wildduck';
    const hostname = config.log.gelf.hostname || os.hostname();
    const gelf =
        config.log.gelf && config.log.gelf.enabled
            ? new Gelf(config.log.gelf.options)
            : {
                  // placeholder
                  emit: () => false
              };

    loggelf = message => {
        if (typeof message === 'string') {
            message = {
                short_message: message
            };
        }
        message = message || {};

        if (!message.short_message || message.short_message.indexOf(component.toUpperCase()) !== 0) {
            message.short_message = component.toUpperCase() + ' ' + (message.short_message || '');
        }

        message.facility = component; // facility is deprecated but set by the driver if not provided
        message.host = hostname;
        message.timestamp = Date.now() / 1000;
        message._component = component;
        Object.keys(message).forEach(key => {
            if (!message[key]) {
                delete message[key];
            }
        });
        gelf.emit('gelf.log', message);
    };

    notifier = new ImapNotifier({
        database: db.database,
        redis: db.redis
    });

    messageHandler = new MessageHandler({
        database: db.database,
        users: db.users,
        redis: db.redis,
        gridfs: db.gridfs,
        attachments: config.attachments,
        loggelf: message => loggelf(message)
    });

    userHandler = new UserHandler({
        database: db.database,
        users: db.users,
        redis: db.redis,
        messageHandler,
        authlogExpireDays: config.log.authlogExpireDays,
        loggelf: message => loggelf(message)
    });

    mailboxHandler = new MailboxHandler({
        database: db.database,
        users: db.users,
        redis: db.redis,
        notifier,
        loggelf: message => loggelf(message)
    });

    server.loggelf = message => loggelf(message);

    usersRoutes(db, server, userHandler);
    addressesRoutes(db, server);
    mailboxesRoutes(db, server, mailboxHandler);
    messagesRoutes(db, server, messageHandler, userHandler);
    filtersRoutes(db, server);
    aspsRoutes(db, server, userHandler);
    totpRoutes(db, server, userHandler);
    custom2faRoutes(db, server, userHandler);
    u2fRoutes(db, server, userHandler);
    updatesRoutes(db, server, notifier);
    authRoutes(db, server, userHandler);
    autoreplyRoutes(db, server);
    submitRoutes(db, server, messageHandler, userHandler);
    domainaliasRoutes(db, server);
    dkimRoutes(db, server);

    server.on('error', err => {
        if (!started) {
            started = true;
            return done(err);
        }

        log.error('API', err);
    });

    server.listen(config.api.port, config.api.host, () => {
        if (started) {
            return server.close();
        }
        started = true;
        log.info('API', 'Server listening on %s:%s', config.api.host || '0.0.0.0', config.api.port);
        done(null, server);
    });
};
