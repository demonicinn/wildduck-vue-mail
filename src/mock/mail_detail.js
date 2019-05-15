import Mock from 'mockjs';
import { param2Obj } from 'utils';

function mockReceiveMail(mailId) {
    return Mock.mock({
        id: mailId,
        title: `No ${mailId} Receiving`,
        content: '<p>I am receiving test data, I am receiving test data.</p><p><img class="wscnph" src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943" data-wscntype="image" data-wscnh="300" data-wscnw="400" data-mce-src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>"',
        sender: '@name',
        sendMail: '@email',
        receiveDate: +Mock.Random.date('T'),
        'isStar|1': true,
        target: [
            {
                name: 'Zeng Yanfen',
                mail: 'zengyanfen@snh48.com'
            },
            {
                name: 'jujingy',
                mail: 'jujingyi@snh48.com'
            },
            {
                name: 'huangtingting',
                mail: 'huangtingting@snh48.com'
            },
            {
                name: 'liyitong',
                mail: 'liyitong@snh48.com'
            },
            {
                name: 'fengxinduo',
                mail: 'fengxinduo@snh48.com'
            }
        ],
        copy: [
            {
                name: 'luting',
                mail: 'luting@snh48.com'
            },
            {
                name: 'wanlina',
                mail: 'wanlina@snh48.com'
            },
            {
                name: 'yijiaai',
                mail: 'yijiaai@snh48.com'
            },
            {
                name: 'linsiyi',
                mail: 'linsiyi@snh48.com'
            },
            {
                name: 'zhaoyue',
                mail: 'zhaoyue@snh48.com'
            }
        ],
        oldFileList: [
            {
                name: 'Fourth Annual General Election',
                url: 'http://onh4i9vxw.bkt.clouddn.com/bq.jpg'
            },
            {
                name: 'Fourth Annual General Election',
                url: 'http://onh4i9vxw.bkt.clouddn.com/bq.jpg'
            }
        ],
        oldAudioList: [
            {
                name: 'MarBlue - Test Song one.mp3',
                url: 'http://or7rpa0sk.bkt.clouddn.com/%E4%B8%89%E6%97%A0MarBlue%20-%20%E6%98%9F%E6%98%9F%E5%92%8C%E9%9B%A8%E7%9A%84%E5%A4%9C.mp3'
            },
            {
                name: 'MarBlue - Test Song two.mp3',
                url: 'http://or7rpa0sk.bkt.clouddn.com/%E4%B8%89%E6%97%A0MarBlue%20-%20%E6%98%9F%E6%98%9F%E5%92%8C%E9%9B%A8%E7%9A%84%E5%A4%9C.mp3'
            }
        ],
        labelList: [
            {
                id: '1',
                name: 'Label 1',
                color: '#00ADB5'
            },
            {
                id: '2',
                name: 'Label 2',
                color: '#F08A5D'
            },
            {
                id: '3',
                name: 'Label 3',
                color: '#F38181'
            }
        ]
    });
}

function mockSendMail(mailId) {
    return Mock.mock({
        id: mailId,
        title: `No  ${mailId} Sending`,
        content: '<p>I am sending test data, I am sending test data.</p><p><img class="wscnph" src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943" data-wscntype="image" data-wscnh="300" data-wscnw="400" data-mce-src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>"',
        sender: 'admin',
        sendMail: 'admin@admin.com',
        sendDate: +Mock.Random.date('T'),
        target: [
            {
                name: 'zengyanfen',
                mail: 'zengyanfen@snh48.com'
            },
            {
                name: 'jujingyi',
                mail: 'jujingyi@snh48.com'
            },
            {
                name: 'huangtingting',
                mail: 'huangtingting@snh48.com'
            },
            {
                name: 'liyitong',
                mail: 'liyitong@snh48.com'
            },
            {
                name: 'fengxinduo',
                mail: 'fengxinduo@snh48.com'
            }
        ],
        copy: [
            {
                name: 'luting',
                mail: 'luting@snh48.com'
            },
            {
                name: 'wanlina',
                mail: 'wanlina@snh48.com'
            },
            {
                name: 'yijiaai',
                mail: 'yijiaai@snh48.com'
            },
            {
                name: 'linsiyi',
                mail: 'linsiyi@snh48.com'
            },
            {
                name: 'zhaoyue',
                mail: 'zhaoyue@snh48.com'
            }
        ],
        oldFileList: [
             {
                name: 'Fourth Annual General Election',
                url: 'http://onh4i9vxw.bkt.clouddn.com/bq.jpg'
            },
            {
                name: 'Fourth Annual General Election',
                url: 'http://onh4i9vxw.bkt.clouddn.com/bq.jpg'
            }
        ],
        oldAudioList: [
            {
                name: 'MarBlue - Test Song three.mp3',
                url: 'http://or7rpa0sk.bkt.clouddn.com/%E4%B8%89%E6%97%A0MarBlue%20-%20%E6%98%9F%E6%98%9F%E5%92%8C%E9%9B%A8%E7%9A%84%E5%A4%9C.mp3'
            },
            {
                name: 'MarBlue - Test song four.mp3',
                url: 'http://or7rpa0sk.bkt.clouddn.com/%E4%B8%89%E6%97%A0MarBlue%20-%20%E6%98%9F%E6%98%9F%E5%92%8C%E9%9B%A8%E7%9A%84%E5%A4%9C.mp3'
            }
        ],
        labelList: [
            {
                id: '1',
                name: 'Lebel 1',
                color: '#00ADB5'
            },
            {
                id: '2',
                name: 'Lebel 2',
                color: '#F08A5D'
            },
            {
                id: '3',
                name: 'Lebel 3',
                color: '#F38181'
            }
        ]
    });
}

function mockDraft(mailId) {
    return Mock.mock({
        id: mailId,
        title: `No ${mailId} Draft`,
        content: '<p>I am draft test data, I am draft test data.</p><p><img class="wscnph" src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943" data-wscntype="image" data-wscnh="300" data-wscnw="400" data-mce-src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
        target: [
            {
                name: 'zengyanfen',
                mail: 'zengyanfen@snh48.com'
            },
            {
                name: 'jujingyi',
                mail: 'jujingyi@snh48.com'
            },
            {
                name: 'uangtingting',
                mail: 'huangtingting@snh48.com'
            },
            {
                name: 'liyitong李艺彤',
                mail: 'liyitong@snh48.com'
            },
            {
                name: 'engxinduo',
                mail: 'fengxinduo@snh48.com'
            }
        ],
        copy: [
            {
                name: 'luting',
                mail: 'luting@snh48.com'
            },
            {
                name: 'wanlina',
                mail: 'wanlina@snh48.com'
            },
            {
                name: 'yijiaai',
                mail: 'yijiaai@snh48.com'
            },
            {
                name: 'linsiyi',
                mail: 'linsiyi@snh48.com'
            },
            {
                name: 'zhaoyue',
                mail: 'zhaoyue@snh48.com'
            }
        ],
        oldFileList: [
             {
                name: 'Fourth Annual General Election',
                url: 'http://onh4i9vxw.bkt.clouddn.com/bq.jpg'
            },
            {
                name: 'Fourth Annual General Election',
                url: 'http://onh4i9vxw.bkt.clouddn.com/bq.jpg'
            }
        ],
        oldAudioList: [
            {
                name: 'MarBlue - test song five.mp3',
                url: 'http://or7rpa0sk.bkt.clouddn.com/%E4%B8%89%E6%97%A0MarBlue%20-%20%E6%98%9F%E6%98%9F%E5%92%8C%E9%9B%A8%E7%9A%84%E5%A4%9C.mp3'
            },
            {
                name: 'MarBlue - test song six.mp3',
                url: 'http://or7rpa0sk.bkt.clouddn.com/%E4%B8%89%E6%97%A0MarBlue%20-%20%E6%98%9F%E6%98%9F%E5%92%8C%E9%9B%A8%E7%9A%84%E5%A4%9C.mp3'
            }
        ]
    });
}

export default {
    getDetail: query => {
        const { mailId, mailType } = param2Obj(query.url);
        if (mailType === 'receive') {
            return mockReceiveMail(mailId);
        } else if (mailType === 'send') {
            return mockSendMail(mailId);
        } else {
            return mockDraft(mailId);
        }
    }
}