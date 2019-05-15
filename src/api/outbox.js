import fetch from 'utils/fetch';
import { Observable } from 'rxjs/Observable';
import axios from 'axios';
import { TEST_LOCAL_API } from './constants';

export function fetchList(query) {
    return fetch({
        url: '/outbox/list',
        method: 'get',
        params: query
    });
}

export function delSendMail(idArr) {
    const idStr = String(idArr);
    console.log('The sender id to delete:' + idStr);
    return Observable.create(observer => {
        setTimeout(() => { observer.next(true); }, 1000);
    });
}

// Local test server api calls

// Create Sent Mail
export const createSentMail = params => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/outboxes'; // 'http://localhost:3000/api/outboxes'
    return axios({
        url: endPoint,
        method: 'post',
        data: params
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});

// Get Sent Mail
export const getSentMail = () => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/outboxes'; // 'http://localhost:3000/api/outboxes'
    return axios({
        url: endPoint,
        method: 'get'
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});

// Get a single Sent Mail
export const getSingleSentMail = id => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/outboxes/' + id; // 'http://localhost:3000/api/outboxes'
    return axios({
        url: endPoint,
        method: 'get'
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});

// Delete Sent Mail
export const deleteSentMail = id => Observable.create(observer => {
    if (id.length > 1) {
        id.forEach(subId => {
            const endPoint = TEST_LOCAL_API + 'api/outboxes/' + subId; // 'http://localhost:3000/api/outboxes/' + id 
            return axios({
                url: endPoint,
                method: 'delete'
            }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
                console.log(error);
                return observer.error(error);
            });
        })
    } else {
        const endPoint = TEST_LOCAL_API + 'api/outboxes/' + id; // 'http://localhost:3000/api/outboxes/' + id 
        return axios({
            url: endPoint,
            method: 'delete'
        }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
            console.log(error);
            return observer.error(error);
        });
    }
});

// Edit Sent Mail
export const editSentMail = params => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/outboxes'; // 'http://localhost:3000/api/outboxes';
    return axios({
        url: endPoint,
        method: 'put',
        data: params
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});