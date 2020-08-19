import request from '@/utils/request'

export function fetchList(data) {
    return request({
        url: '/message/board/fetchList',
        method: 'post',
        data: data
    })
}

export function createMessage(data) {
    return request({
        url: '/message/board/send',
        method: 'post',
        data: data
    })
}

export function updateMessage(data) {
    return request({
        url: '/message/board/update',
        method: 'post',
        data: data
    })
}

export function selectByid(id) {
    return request({
        url: '/message/board/select/' + id,
        method: 'get',
    })
}