import request from '@/utils/request';

//获取地址
export function getFactoryAddress(id) {
    return request({
        url: '/factory/address/list/' + id,
        method: 'get',
    })
}

//修改地址
export function updateFactoryAddress(id, data) {
    return request({
        url: '/factory/address/' + id,
        method: 'patch',
        data: data
    })
}

//删除地址
export function deleteFactoryAddress(id) {
    return request({
        url: '/factory/address/' + id,
        method: 'delete',
    })
}
//批量修改状态
export function batchAddressUpdateStatus(data) {
    return request({
        url: '/factory/address/batchUpdateStatus',
        method: 'post',
        data: data
    })
}
//批量删除
export function deleteFactoryAddressBatch(ids) {
    return request({
        url: '/factory/address/delete/batch',
        method: 'post',
        data: ids
    })
}
export function createFactoryAddress(data) {
    return request({
        url: '/factory/address/create',
        method: 'post',
        data: data
    })
}