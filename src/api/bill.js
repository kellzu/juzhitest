import request from '@/utils/request'

export function billFetchList(data) {
    return request({
        url: '/fms/bill/fetchList',
        method: 'post',
        data: data
    })
}

export function billDetail(id) {
    return request({
        url: '/fms/bill/billDetail/' + id,
        method: 'get',
    })
}

export function addBillDetail(id, data) {
    return request({
        url: "/fms/bill/addBillDetail/" + id,
        method: 'post',
        data: data
    })
}

export function getProfit() {
    return request({
        url: '/fms/bill/profit',
        method: 'get'
    })
}