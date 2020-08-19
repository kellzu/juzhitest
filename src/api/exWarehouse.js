import request from '@/utils/request';

export function exlist(data) {
    return request({
        url: '/customer/order/exList',
        method: 'post',
        data: data
    })
}

export function addExDetail(id, data) {
    return request({
        url: '/customer/order/addExDetail/' + id,
        method: 'post',
        data: data
    })
}

export function updateExDetail(id, data) {
    console.log(data)
}

// kfoot
// 获取待发货单详情
export function shipmentsData(id) {
    return request({
        url: '/customer/order/findById/' + id,
        method: 'GET'
    })
}
// 修改物流信息
export function upDateOrder(data) {
    return request({
        url: '/customer/order/upDateOrder',
        method: 'post',
        data:data,
        headers: {
            'Content-Type': 'application/json'
        },
    })
}

// 待发货查询
export function ToBeDeliveredList(data) {
    return request({
        url: '/customer/order/ToBeDeliveredList',
        method: 'post',
        data:data
    })
}