import Mock from 'mockjs';

const list = [];
const count = 6;

for (let i = 0; i < count; i++) {
    list.push(Mock.mock({
        id: '@increment',
        name: '@title',
        contacts: [
            {
                name: 'Zengyanfe',
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
                name: 'engxinduo',
                mail: 'fengxinduo@snh48.com'
            },
            {
                name: 'luting',
                mail: 'luting@snh48.com'
            }
        ]
    }));
}

export default {
    getList: () => {
        return {
            total: list.length,
            groupList: list
        }
    }
};