'use strict';

const db = require('../db');
const consts = require('../consts');

// STATUS (X Y X)
module.exports = server => (path, session, callback) => {
    server.logger.debug(
        {
            tnx: 'status',
            cid: session.id
        },
        '[%s] Requested status for "%s"',
        session.id,
        path
    );
    db.database.collection('mailboxes').findOne(
        {
            user: session.user.id,
            path
        },
        {
            maxTimeMS: consts.DB_MAX_TIME_MAILBOXES
        },
        (err, mailboxData) => {
            if (err) {
                return callback(err);
            }
            if (!mailboxData) {
                return callback(null, 'NONEXISTENT');
            }

            db.database
                .collection('messages')
                .find({
                    mailbox: mailboxData._id,
                    // uid is part of the sharding key so we need it somehow represented in the query
                    uid: {
                        $gt: 0,
                        $lt: mailboxData.uidNext
                    }
                })
                .maxTimeMS(consts.DB_MAX_TIME_MESSAGES)
                .count((err, total) => {
                    if (err) {
                        return callback(err);
                    }
                    db.database
                        .collection('messages')
                        .find({
                            mailbox: mailboxData._id,
                            unseen: true,
                            // uid is part of the sharding key so we need it somehow represented in the query
                            uid: {
                                $gt: 0,
                                $lt: mailboxData.uidNext
                            }
                        })
                        .maxTimeMS(consts.DB_MAX_TIME_MESSAGES)
                        .count((err, unseen) => {
                            if (err) {
                                return callback(err);
                            }

                            return callback(null, {
                                messages: total,
                                uidNext: mailboxData.uidNext,
                                uidValidity: mailboxData.uidValidity,
                                unseen
                            });
                        });
                });
        }
    );
};
