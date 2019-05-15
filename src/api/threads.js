// Library imports
import { Observable } from 'rxjs/Observable';
import axios from 'axios';

// Local imports
import { TEST_LOCAL_API } from './constants';

// Local test server api calls

// Create a Thread
export const createThread = params => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/Threads'; // 'http://localhost:3000/api/Threads'
    console.log('Params: ' + params);
    return axios({
        url: endPoint,
        method: 'post',
        data: params
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});

// Get Threads
export const getThreads = () => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/Threads'; // 'http://localhost:3000/api/Threads'
    return axios({
        url: endPoint,
        method: 'get'
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});

// Delete a Thread
export const deleteThread = id => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/Threads/' + id; // 'http://localhost:3000/api/Threads/' + id 
    return axios({
        url: endPoint,
        method: 'delete'
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});

// Edit a Thread
export const editThread = params => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/Threads'; // 'http://localhost:3000/api/Threads';
    return axios({
        url: endPoint,
        method: 'put',
        data: params
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});