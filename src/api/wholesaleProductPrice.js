import request from '@/utils/request'

var baseEntityPath = '/wholesale/product/price'; 

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
    url:  `${baseEntityPath}/batchUpdateStatus`,
    method: 'post',
    data: data
  })
}

export function batchUpdateEntity(data) {
  return request({
    url:  `${baseEntityPath}/update/batch`,
    method: 'put',
    data: data
  })
}

export function batchDeleteEntity(data) {
  return request({
    url:  `${baseEntityPath}/delete/batch`,
    method: 'post',
    data: data
  })
}

export function getEntityIdName(name) {
  if (name === null || name === undefined) {
    name = '';
  }
  return request({
    url: `${baseEntityPath}/list/id-name?name=${name}`,
    method: 'get',
  })
}

