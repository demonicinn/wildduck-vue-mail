import fetch from 'utils/fetch';
import { Observable } from 'rxjs/Observable';

export function fetchList(query) {
    return fetch({
        url: '/mail_list',
        method: 'get',
        params: query
    });
}

export function delMail(idArr) {
    const idStr = String(idArr);
    console.log('The message id to delete:' + idStr);
    return Observable.create(observer => {
        setTimeout(() => { observer.next(true); }, 500);
    });
}

export function unDoDelMail(idArr) {
    const idStr = String(idArr);
    console.log('To undelete the deleted message id:' + idStr);
    return Observable.create(observer => {
        setTimeout(() => { observer.next(true); }, 500);
    });
}
