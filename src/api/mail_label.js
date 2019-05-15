// Library imports
import { Observable } from 'rxjs/Observable';
import axios from 'axios';

// Local imports
import fetch from 'utils/fetch';
import { TEST_LOCAL_API } from './constants';

export function fetchList() {
    return fetch({
        url: '/mail_label/list',
        method: 'get'
    });
}

export function add(labelDTO) {
    // console.log(labelDTO);
    // alert();
    return Observable.create(observer => {
        observer.next(labelDTO);
        observer.complete();

        // setTimeout(observer.next(labelDTO), 100);
    })
}

export function edit(labelDTO) {
    return Observable.create(observer => {
        setTimeout(observer.next(labelDTO), 100);
    })
}

export function del(id) {
    return Observable.create(observer => {
        setTimeout(observer.next(), 20);
    })
}

export function toggleStar(idArr) {
    return Observable.create(observer => {
        setTimeout(observer.next(), 20)
    })
}

export function markLabel(idArr) {
    return Observable.create(observer => {
        setTimeout(observer.next(), 20);
    })
}

// Local test server api calls

// Create Label
export const createLabel = params => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/Labels'; // 'http://localhost:3000/api/Labels'
    return axios({
        url: endPoint,
        method: 'post',
        data: params
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});

// Get labels
export const getLabel = () => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/Labels';  // 'http://localhost:3000/api/Labels'
    return axios({
        url: endPoint,
        method: 'get'
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});

// Delete Label
export const deleteLabel = id => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/Labels/' + id; // 'http://localhost:3000/api/Labels/' + id
    return axios({
        url: endPoint,
        method: 'delete'
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});

// Edit Label
export const editLabel = params => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/Labels'; // 'http://localhost:3000/api/Labels'
    return axios({
        url: endPoint,
        method: 'put',
        data: params
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});