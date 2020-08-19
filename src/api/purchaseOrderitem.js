import request from '@/utils/request';



export function getItemByPurchaseId(id) {
    return request({
        url: "/purchase/order/id/" + id,
        method: 'get',
    })
}

export function updatePurchaseitem(id, data) {
    return request({
        url: '/purchase/order/id/updateBatch/' + id,
        method: 'post',
        data: data
    })
}