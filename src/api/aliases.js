// Library imports
import { Observable } from 'rxjs/Observable';
import axios from 'axios';

// Local imports
import { TEST_LOCAL_API } from './constants';

// Local test server api calls

// Create Alias
export const createAlias = params => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/Aliases'; // 'http://localhost:3000/api/Aliases'
    return axios({
        url: endPoint,
        method: 'post',
        data: params
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});

// Get Aliases
export const getAlias = () => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/Aliases'; // 'http://localhost:3000/api/Aliases'
    return axios({
        url: endPoint,
        method: 'get'
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});

// Delete Alias
export const deleteAlias = id => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/Aliases/' + id; // 'http://localhost:3000/api/Aliases/' + id;
    return axios({
        url: endPoint,
        method: 'delete'
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});

// Edit Alias
export const editAlias = params => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/Aliases'; // 'http://localhost:3000/api/Aliases';
    return axios({
        url: endPoint,
        method: 'put',
        data: params
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});