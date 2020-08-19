import request from '@/utils/request';

export function createExpenseClaim(data) {
    return request({
        url: '/expense/claim/create',
        method: 'post',
        data: data
    })
}

export function fetchList(data) {
    return request({
        url: '/expense/claim/fetchList',
        method: 'post',
        data: data
    })
}

export function getDetail(id) {
    return request({
        url: '/expense/claim/' + id,
        method: 'get'
    })
}