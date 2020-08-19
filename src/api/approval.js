import request from '@/utils/request';


const baseEntityPath = '/approval';

export function commit(id, data) {
    return request({
        url: `${baseEntityPath}/commit/${id}`,
        method: 'post',
        data: data
    })
}

export function commitToGroup(id, data) {
    return request({
        url: `${baseEntityPath}/commitToGroup/${id}`,
        method: 'post',
        data: data
    })
}

export function commitToPrincipal(id, data) {
    return request({
        url: `${baseEntityPath}/commitToPrincipal/${id}`,
        method: 'post',
        data: data
    })
}

export function commitToFinance(id, data) {
    return request({
        url: `${baseEntityPath}/commitToFinance/${id}`,
        method: 'post',
        data: data
    })
}

export function approvedMemo(id) {
    return request({
        url: `${baseEntityPath}/approvedMemo/${id}`,
        method: 'get',
    })
}

export function rejectPurchaseOrder(id, data) {
    return request({
        url: `${baseEntityPath}/reject/${id}`,
        method: 'get',
        data: data
    })
}

export function approval(id) {
    return request({
        url: `${baseEntityPath}/detail/${id}`,
        method: 'get',
    })
}