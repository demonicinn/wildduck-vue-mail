import { param2Obj } from 'utils';

const userMap = {
  admin: {
    role: ['admin'],
    token: 'admin',
    introduction: 'I am a super administrator',
    // avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    avatar: 'http://or7rpa0sk.bkt.clouddn.com/avatar3.gif',
    name: 'Admin',
    uid: '001'
  }
}

export default {
  loginByEmail: config => {
    const { email } = JSON.parse(config.body);
    return userMap[email.split('@')[0]];
  },
  getInfo: config => {
    const { token } = param2Obj(config.url);
    if (userMap[token]) {
      return userMap[token];
    } else {
      return Promise.reject('a');
    }
  },
  logout: () => 'success'
};
