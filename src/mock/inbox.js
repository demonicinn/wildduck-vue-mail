import Mock from 'mockjs';
import { param2Obj } from 'utils';

const list = [];
const count = 100;

for (let i = 0; i < count; i++) {
    list.push(Mock.mock({
        id: '@increment',
        'isStar|1': true,
        'isHaveFile|1': true,
        'isHaveAudio|1': true,
        'status|1': [0, 1, 2, 3],
        sendName: '@name',
        sendMail: '@email',
        labelList: [
            {
                guid: '1',
                name: 'Label 1'
            },
            {
                guid: '2',
                name: 'Label 2'
            },
            {
                guid: '3',
                name: 'Label 3'
            }
        ],
        title: '@title(10, 30)',
        receiveDate: +Mock.Random.date('T'),
        readDate: +Mock.Random.date('T')
    }));
}

export default {
    getList: config => {
        const { status, title, page, limit, sort, order } = param2Obj(config.url);
        let mockList = list.filter(item => {
            if (status && item.status !== +status) return false;
            if (title && item.title.indexOf(title) < 0) return false;
            return true;
        });
        function orderFunc(a, b) {
            if (order === 'ascending') {
                return a[sort] - b[sort];
            } else {
                return b[sort] - a[sort];
            }
        }
        sort && mockList.sort(orderFunc);
        if (page) {
            mockList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));
        }
        return {
            total: mockList.length,
            items: mockList
        }
    }
};