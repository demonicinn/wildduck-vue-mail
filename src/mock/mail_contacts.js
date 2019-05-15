import Mock from 'mockjs';
import { param2Obj } from 'utils';

let list = [];
const count = 100;

for (let i = 0; i < count - 5; i++) {
    list.push(Mock.mock({
        id: '@increment',
        name: '@name',
        mail: '@email("abc.com")',
        avatarUrl: 'https://c1.staticflickr.com/9/8046/8082447203_14ec1579b4_z.jpg'
    }));
}
list = list.concat([
    {
        id: '-1',
        name: 'Test1',
        mail: 'zengyanfen@snh48.com',
        avatarUrl: 'https://c1.staticflickr.com/9/8046/8082447203_14ec1579b4_z.jpg'
    },
    {
        id: '-2',
        name: 'Test 2',
        mail: 'jujingyi@snh48.com',
        avatarUrl: 'https://c1.staticflickr.com/9/8046/8082447203_14ec1579b4_z.jpg'
    },
    {
        id: '-2',
        name: 'Test 3',
        mail: 'huangtingting@snh48.com',
        avatarUrl: 'https://c1.staticflickr.com/9/8046/8082447203_14ec1579b4_z.jpg'
    },
    {
        id: '-3',
        name: 'Test 4',
        mail: 'fengxinduo@snh48.com',
        avatarUrl: 'https://c1.staticflickr.com/9/8046/8082447203_14ec1579b4_z.jpg'
    },
    {
        id: '-4',
        name: 'Test 5',
        mail: 'khaled@ixxo.com',
        avatarUrl: 'https://c1.staticflickr.com/9/8046/8082447203_14ec1579b4_z.jpg'
    }
]);

export default {
    getList: config => {
        const { name, mail, groupId, page, limit } = param2Obj(config.url);
        let mockList = list.filter(item => {
            if (name && item.name.indexOf(name) < 0) return false;
            if (mail && item.mail.indexOf(mail) < 0) return false;
            if (groupId && item.groupId !== groupId) return false;
            return true;
        });
        if (page) {
            mockList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));
        }
        return {
            total: list.length,
            contacts: mockList
        }
    }
};