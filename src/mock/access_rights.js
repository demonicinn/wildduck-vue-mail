// Library imports
import { Observable } from 'rxjs/Observable';
import axios from 'axios';
import Mock from 'mockjs';

// Local imports
import { TEST_LOCAL_API } from '../api/constants';

// Local test server api calls

// Update a Thread
export const updateThread = params => Observable.create(observer => {
    const endPoint = TEST_LOCAL_API + 'api/Threads'; // 'http://localhost:3000/api/Threads'
    console.log('Params: ' + params);
    params.children[0].thread = Mock.Random.paragraph(1, 3);
    params.children[0].sender = Mock.Random.email();

    return axios({
        url: endPoint,
        method: 'put',
        data: params
    }).then(response => { console.log(response); return observer.next(response); }).catch(error => {
        console.log(error);
        return observer.error(error);
    });
});
