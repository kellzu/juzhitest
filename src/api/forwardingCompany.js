import request from '@/utils/request'

export function fetchList(params) {
    return request({
        url: '/forwarding/company/fetchList',
        method: 'get',
        params: params
    })
}

export function createHandler(data) {
    return request({
        url: '/forwarding/company/',
        method: 'post',
        data: data
    })
}

export function batchUpdateStatus(data) {
    return request({
        url: '/forwarding/company/batchUpdateStatus',
        method: 'post',
        data: data
    })
}

export function updateDetail(id, data) {
    return request({
        url: '/forwarding/company/' + id,
        method: 'put',
        data: data
    })
}

export function getDetail(id) {
    return request({
        url: '/forwarding/company/' + id,
        method: 'get',
    })
}

export function updateRouteModel(id, data) {
    return request({
        url: '/forwarding/route/mode/' + id,
        method: 'put',
        data: data
    })
}

export function getList() {
    return request({
        url: '/forwarding/company/list',
        method: 'get',
    })
}