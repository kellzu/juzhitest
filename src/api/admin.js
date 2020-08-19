import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: params
  })
}
export function createAdmin(data) {
  return request({
    // POST /admin/registerAndSetRole
    url: '/admin/registerAndSetRole',
    method: 'post',
    data: data
  })
}

export function deleteAdmin(id) {
  return request({
    url: '/admin/delete/' + id,
    method: 'get',
  })
}

export function getAdmin(id) {
  return request({
    url: '/admin/' + id,
    method: 'get',
  })
}

export function updateAdmin(id, data) {
  return request({
    url: '/admin/update/' + id,
    method: 'post',
    data: data
  })
}

export function batchUpdateAdminStatus(data) {
  return request({
    url: '/admin/update/batchStatus',
    method: 'post',
    data: data
  })
}

export function updateAdminStatus(id, data) {
  return request({
    url: '/admin/update/' + id,
    method: 'post',
    data: data
  })
}

export function batchDeleteAdmin(data) {
  return request({
    url: '/admin/delete/batch',
    method: 'post',
    data: data
  })
}

export function updateAdminRole(id, roleIds) {
  return request({
    url: '/admin/role/update?adminId=' + id + '&roleIds=' + roleIds,
    method: 'post',
  })
}

export function getAdminRole(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get',
  })
}

export function getAdminPermission(id) {
  return request({
    url: '/admin/permission/' + id,
    method: 'get',
  })
}


export function getAdminIdNames(params) {
  return request({
    url: '/admin/list/id-name',
    params: params,
    method: 'get',
  })
}

export function getAdminByRole(id) {
  return request({
    url: '/admin/list/roleId/' + id,
    method: 'get'
  })
}

export function getMyAdminDetail() {
  return request({
    url: '/admin/detail',
    method: 'get',
  })
}

export function getGroupMember(id) {
  return request({
    url: '/admin/group/member/' + id,
    method: 'get',
  })
}

export function getGroupUserAndId() {
  return request({
    url: '/admin/group/user-id',
    method: 'get'
  })
}