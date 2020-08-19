import request from '@/utils/request'

var baseEntityPath = '/album';

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

export function batchCreateEntity(data) {
  return request({
    url: `${baseEntityPath}/create/batch`,
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

export function deletePic(picId, picPath) {
  return request({
    url: "/album/pic/deletePic",
    method: "post",
    params: {
      picId: picId,
      picPath: picPath
    }
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

export function batchDeleteEntity(data) {
  return request({
    url: `${baseEntityPath}/delete/batch`,
    method: 'post',
    data: data
  })
}

export function batchGetEntity(data) {
  return request({
    url: `${baseEntityPath}/get/batch`,
    method: 'post',
    data: data
  })
}

export function addAlbumPicList(id, data) {
  return request({
    url: '/purcher/order/addAlbumPic/' + id,
    method: 'post',
    data: data
  })
}

