import request from '@/utils/request'

var baseEntityPath = '/business/group';

export function fetchList(params) {
  return request({
    url: `${baseEntityPath}/list`,
    method: 'get',
    params: params
  })
}

export function createEntity(data) {
  return request({
    url: `${baseEntityPath}`,
    method: 'post',
    data: data
  })
}

export function deleteEntity(id) {
  return request({
    url: `${baseEntityPath}/` + id,
    method: 'delete',
  })
}

export function getEntity(id) {
  return request({
    url: `${baseEntityPath}/` + id,
    method: 'get',
  })
}

export function updateEntity(id, data) {
  return request({
    url: `${baseEntityPath}/` + id,
    method: 'put',
    data: data
  })
}

export function patchEntity(id, data) {
  return request({
    url: `${baseEntityPath}/` + id,
    method: 'patch',
    data: data
  })
}

export function batchUpdateEntityStatus(data) {
  return request({
    url: `${baseEntityPath}/batchUpdateStatus`,
    method: 'post',
    data: data
  })
}

export function batchDeleteEntity(data) {
  return request({
    url: `${baseEntityPath}/delete/batch`,
    method: 'post',
    data: data
  })
}

export function groupIdNameList() {
  return request({
    url: `${baseEntityPath}/list/all`,
    method: 'get',
  })
}

