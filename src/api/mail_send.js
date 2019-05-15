// Library imports
import { Observable } from 'rxjs/Observable';
import axios from 'axios';

// Local imports
import fetch from 'utils/fetch';
// import { REMOTE_DEV_API } from './constants';

export function sendMail(mailDTO) {
    // Observe whether the mailDTO in formData format is correct
    // $.ajax({
    //     url: 'https://httpbin/post',
    //     type: 'POST',
    //     processData: false,    // 不处理发送的数据
    //     contentType: false,    // 不设置Content-Type请求头
    //     enctype: 'multipart/form-data',
    //     data: mailDTO
    // })
    return Observable.create(observer => {
        setTimeout(() => observer.next(), 2000);
    })
}

export function saveAsDraft(mailDTO) {
    return Observable.create(observer => {
        setTimeout(() => observer.next(), 1000);
    })
}

// Remote dev api calls
// export function remoteAPISendMail(params) {
//     return Observable.create(observer => {
//         return fetch({
//             url: '/users/' + '5cb06a464e8d227f40693b91' + '/submit' ,
//             method: 'post',
//             data: params
//         });
//     })
// }

// Send email using wildduck api
export const wildduckAPISendMail = params => Observable.create(observer => {
    const endPoint = 'api/users/' + '5cb06a464e8d227f40693b91' + '/submit';
    return axios({
        url: endPoint,
        method: 'post',
        data: params
    }).then(response => { console.log(response); return observer.next(); }).catch(error => {
        console.log(error);
        return observer.error();
    });
})

// export const wildduckAPISendMail = params => {
//     const endPoint = '/users/' + '5cb06a464e8d227f40693b91' + '/submit';
//     debugger
//     return fetch({
//         url: endPoint,
//         method: 'post',
//         data: params
//     }).then(response => { console.log(response); return response }).catch(error => {
//         console.log(error);
//         return error;
//     });
// }
