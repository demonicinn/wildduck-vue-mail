import fetch from 'utils/fetch';

export function fetchList(query) {
    return fetch({
        url: '/folder_list/list',
        method: 'get',
        params: query
    });
}

