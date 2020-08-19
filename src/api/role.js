import request from '@/utils/request'

export function rolelist() {
  return request({
    url: '/role/list',
    method: 'get',
  })
}

export function getRolePerminssion(id) {
  return request({
    url: '/role/permission/'+id,
    method: 'get',
  })
}

export function createRole(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data: data
  })
}

export function updataRole(id,data) {
  return request({
    url: '/role/update/'+ id,
    method: 'post',
    data: data
  })
}

export function getRolePage(params) {
  return request({
    url: '/role/pagelist',
    method: 'get',
    params:params
  })
}

export function updataRolePermission(id,data){
  return request({
    url: '/role/permission/update?roleId='+id+'&permissionIds='+data,
    method:'post',
  })
}

export function deleteRole(params){
  return request({
    url:'/role/delete?ids='+params,
    method:'post',
  })
}

export function updataRoleStatus(ids,status){
  return request({
    url:'/role/updataStatus?ids='+ids+'&status='+status,
    method:'post',
  })
}

