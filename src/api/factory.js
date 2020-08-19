import request from '@/utils/request';

export function getFactoryList(params) {
    return request({
        url: '/factory/list',
        method: 'get',
        params: params
    })
}

export function getFactoryDetail(id) {
    return request({
        url: '/factory/detail/' + id,
        method: 'get',
    })
}

export function updateFactory(id, data) {
    return request({
        url: '/factory/' + id,
        method: 'put',
        data: data
    })
}

export function createFactory(data) {
    return request({
        url: '/factory',
        method: 'post',
        data: data
    })
}

// 逻辑删除
export function deleteFactorys(ids) {
    return request({
        url: '/factory/delete/batch',
        method: 'post',
        data: ids
    })
}

// 物理删除 注意！
export function deleteReality(id) {
    return request({
        url: '/factory/delete/' + id,
        method: 'delete'
    })
}
// 批量修改厂商状态
export function batchUpdateStatus(data) {
    return request({
        url: '/factory/batchUpdateStatus',
        method: 'post',
        data: data
    })
}

// 获取工厂id和name信息
export function getEntityIdName(name) {
    if (name === null || name === undefined) {
        name = '';
    }
    return request({
        url: `/factory/list/id-name?name=${name}`,
        method: 'get',
    })
}
