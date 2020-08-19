import request from '@/utils/request'

var BASE_API = '/performance'

export function performance(data) {
    return request({
        url: `${BASE_API}/list`,
        method: 'POST',
        data: data
    })
}

export function performanceDetail(params) {
    return request({
        url: `${BASE_API}/detail`,
        method: 'post',
        data: params
    })
}

export function addParyroll(id, data) {
    return request({
        url: `${BASE_API}/addParyroll/${id}`,
        method: 'POST',
        data: data
    })
}

export function getAccumulatedLoss(id) {
    return request({
        url: `${BASE_API}/accumulatedLoss/${id}`,
        method: 'get',
    })
}