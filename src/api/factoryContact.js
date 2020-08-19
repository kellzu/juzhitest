import request from '@/utils/request';
//通过factoryid获取联系人列表
export function getFactoryContact(id) {
    return request({
        url: '/factory/contact/query/' + id,
        method: 'get',
    })
}
//删除联系人
export function deleteFactoryContact(id) {
    return request({
        url: '/factory/contact/' + id,
        method: 'delete',
    })
}
//更新厂商联系人
export function updateFactoryContact(id, data) {
    return request({
        url: '/factory/contact' + id,
        method: 'put',
        data: data
    })
}
//批量修改联系人状态
export function batchUpdateContactStatus(data) {
    return request({
        url: '/factory/contact/batchUpdateStatus',
        method: 'post',
        data: data
    })
}
//批量删除联系人
export function deleteFactoryContactBacth(ids) {
    return request({
        url: '/factory/contact/delete/batch',
        method: 'post',
        data: ids
    })
}
//创建厂商联系人
export function createFactoryContact(data) {
    return request({
        url: '/factory/contact/create',
        method: 'post',
        data: data
    })
}