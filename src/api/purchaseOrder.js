import request from '@/utils/request'

var baseEntityPath = '/purcher/order';

export function fetchList(params) {
    return request({
        url: `${baseEntityPath}/list`,
        method: 'post',
        data: params
    })
}

export function createEntity(data) {
    return request({
        url: `${baseEntityPath}`,
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

export function sendEmail(data) {
    return request({
        url: "/purcher/order/send-email/expense-purchase-fee",
        method: 'post',
        data: data
    })
}

export function addCredentialPic(data) {
    return request({
        url: "",
        method: 'post',
        data: data
    })
}

export function generateSn() {
    return request({
        url: `${baseEntityPath}/generateSn`,
        method: 'get'
    })
}

export function acceptanceList(data) {
    return request({
        url: `${baseEntityPath}/acceptanceList`,
        method: 'post',
        data: data
    })
}