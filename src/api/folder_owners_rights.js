import fetch from 'utils/fetch';
// import { Observable } from 'rxjs/Observable';

export function setOwnersRightsForFile (query) {
    // return Observable.create(observer => {
    //     setTimeout(() => observer.next(), 2000);
    // });
    return fetch({
        url: '/SetOwnersRightsForFile',
        method: 'put',
        params: query
    });
}

export function setOwnersRightsForFolder (query) {
    // return Observable.create(observer => {
    //     setTimeout(() => observer.next(), 2000);
    // });
    return fetch({
        url: '/SetOwnersRightsForFolder',
        method: 'put',
        params: query
    });
}