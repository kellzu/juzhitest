import request from '@/utils/request'
export function policy() {
  return request({
    url:'/aliyun/oss/policy',
    method:'get',
  })
}


export function policyUrl(params) {
  return request({
    url:'/aliyun/oss/policy/url',
    method:'get',
    params: params
  })
}
