import request from '@/utils/request'

var baseEntityPath = '/spider'; 

export function fetchList(params) {
  return request({
    url: `${baseEntityPath}/list`,
    method: 'get',
    params: params
  })
}

export function getByUrlApi(data) {
  return request({
    url: `${baseEntityPath}/selectByUrl`,
    method: 'post',
    data: data
  })
}