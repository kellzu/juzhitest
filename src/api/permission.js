import request from '@/utils/request'

export function permissionlist() {
  return request({
    url: '/permission/treeList',
    method: 'get',
  })
}

export function createpermission(data) {
  return request({
    url: '/permission/create',
    method: 'post',
    data: data
  })
}

export function updatePermission(id, data) {
  return request({
    url: '/permission/update/' + id,
    method: 'post',
    data: data
  })
}

export function updatePermissionStatus(params) {
  return request({
    url: '/permission/updateStatus',
    method: 'post',
    params: params
  })
}
export function deletePermissions(ids) {
  return request({
    url: '/permission/delete?ids=' + ids,
    method: 'post'
  })
}
