import request from '@/utils/request';
var baseEntityPath = '/customer/order';

export function fetchList(params) {
    return request({
        url: `${baseEntityPath}/list`,
        method: 'post',
        data: params
    })
}

export function createEntity(data) {
    return request({
        url: `${baseEntityPath}/create`,
        method: 'post',
        data: data
    })
}

export function deleteEntity(ids) {
    return request({
        url: `${baseEntityPath}/` + ids,
        method: 'delete',
    })
}

export function getEntity(id) {
    return request({
        url: `${baseEntityPath}/` + id,
        method: 'get',
    })
}


export function updateEntity(id, data) {
    return request({
        url: `${baseEntityPath}/` + id,
        method: 'put',
        data: data
    })
}

export function patchEntity(id, data) {
    return request({
        url: `${baseEntityPath}/` + id,
        method: 'patch',
        data: data
    })
}

export function batchUpdateEntityStatus(data) {
    return request({
        url: `${baseEntityPath}/batchUpdateStatus`,
        method: 'post',
        data: data
    })
}

export function batchDeleteEntity(data) {
    return request({
        url: `${baseEntityPath}/delete/batch`,
        method: 'post',
        data: data
    })
}

export function customerOrderList(params) {
    return request({
        url: `${baseEntityPath}/list/all`,
        method: 'get',
        params: params
    })
}

export function invoiceProforma(id) {
    return request({
        url: `/invoice/proforma`,
        method: 'post',
        params: {customerId:id},
        responseType: 'blob',
    })
}
