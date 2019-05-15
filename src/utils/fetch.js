import axios from 'axios';
import { Message } from 'element-ui';
import store from '../store';
// import router from '../router';

// Create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // Api's base_url
  timeout: 5000                  // Request timeout
});

// requestInterceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['X-Token'] = store.getters.token; // Let each request carry token--['X-Token'] as a custom key. Please modify it according to the actual situation.
  }
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
})

// Response interceptor
service.interceptors.response.use(
  response => response
  /**
  * The following comment is passedresponseCustom codeTo indicate the status of the request，whencodeReturn the following situation as a problem with permissions，Log out and return to the login page
  * As passedxmlhttprequest Status code identification Logic can be written belowerrorin
  */
  // const code = response.data.code;
  // // 50014:Token expired 50012:Other clients are logged in 50008:Unlawfultoken
  // if (code === 50008 || code === 50014 || code === 50012) {
  //   Message({
  //     message: res.message,
  //     type: 'error',
  //     duration: 5 * 1000
  //   });
  //   // Sign out
  //   store.dispatch('FedLogOut').then(() => {
  //     router.push({ path: '/login' })
  //   });
  // } else {
  //   return response
  // }
  ,
  error => {
    console.log('err' + error);// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
)

export default service;
