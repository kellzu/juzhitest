import request from '@/utils/request'

const BASE_PATH = '/company/meeting';

export function createMeeting(meetingEntity) {
    return request({
        url: `${BASE_PATH}/create`,
        method: 'post',
        data: meetingEntity
    })
}

export function fetchList(data) {
    return request({
        url: `${BASE_PATH}/list`,
        method: 'post',
        data: data
    })
}

export function getDetail(id) {
    return request({
        url: `${BASE_PATH}/meetingDetail/${id}`,
        method: 'GET',
    })
}

// export function accomplish(id) {
//     return request({
//         url: `${BASE_PATH}/accomplish`,
//         method: 'post',
//         params: id
//     })
// }
// kfoot_api
// 删除会议
export function delMeeting(id) {
    return request({
        url: `${BASE_PATH}/delMeeting?id=${id}`,
        method: 'GET'
    })
}

/**
 * 
 * @param {*} id 
 * @param {*} status  :wait 待完成，normal 正常，delete 删除，complete 完成，cancel 取消状态 
 */
export function updateStatus(id, status) {
    return request({
        url: `${BASE_PATH}/updateStatus?id=${id}&status=${status}`,
        method: 'GET'
    })
}