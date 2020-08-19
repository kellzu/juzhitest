import request from '@/utils/request'

export function homeMessage() {
    return request({
        url: '/home/message',
        method: 'get'
    })
}