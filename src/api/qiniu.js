import fetch from 'utils/fetch';

export function getToken() {
  return fetch({
    url: '/qiniu/upload/token', //Fake address
    method: 'get'
  });
}
