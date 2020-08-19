import request from '@/utils/request';

var baseEntityPath = '/customer/order/item';

export function listByOrderId(id) {
    return request({
        url: `${baseEntityPath}/${id}`,
        method: 'get',
    })
}

export function updateItem(id, data) {
    return request({
        url: `${baseEntityPath}/${id}`,
        method: 'POST',
        data: data
    })
}

export function getCustomerProductItem(ids) {
    return request({
        url: `${baseEntityPath}/product/item/${ids}`,
        method: 'get'
    })
}