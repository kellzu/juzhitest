import request from '@/utils/request';

export function getDeliveryDetail(params) {
    return request({
        url: '/delivery/' + params,
        method: 'get',
    })
}

export function getProductsToAcceptance(params) {
    return request({
        url: '/delivery/getDetail/' + params,
        method: 'get'
    })
}

export function getGlobalLogistics(id) {
    return request({
        url: '/delivery/global/' + id,
        method: 'get',
    })
}

export function getDomesticLogistics(id) {
    return request({
        url: '/delivery/domestic/' + id,
        method: 'get',
    })
}

export function addGlobalDelivery(id, data) {
    return request({
        url: '/delivery/addGlobalDelivery/' + id,
        method: 'post',
        data: data
    })
}