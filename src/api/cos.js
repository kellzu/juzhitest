import request from '@/utils/request'

const BASE_PATH = '/qcloud/cos';

export function policy(params) {
    return request({
        url: `${BASE_PATH}/policy`,
        method: 'get',
        params: params,
    })
}

export function policyUrl(params) {
    return request({
        url: `${BASE_PATH}/policy/url`,
        method: 'get',
        params: params,
    })
}

export function deleteFile(params) {
    return request({
        url: `${BASE_PATH}/delSingleFile`,
        method: 'delete',
        params: params,
    })
}