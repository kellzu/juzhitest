import request from '@/utils/request'


const BASE_PATH = '/wholesale/product';
const ADC_AONY = '/customer/order';
export function fetchList(params) {
  return request({
    url: `${BASE_PATH}/list`,
    method: 'get',
    params: params
  })
}

export function fetchSimpleList(params) {
  return request({
    url: `${BASE_PATH}/simpleList`,
    method: 'get',
    params: params
  })
}

export function updateDeleteStatus(params) {
  return request({
    url: `${BASE_PATH}/update/deleteStatus`,
    method: 'post',
    params: params
  })
}

export function updateRecommendStatus(params) {
  return request({
    url: `${BASE_PATH}/update/recommendStatus`,
    method: 'post',
    params: params
  })
}

export function updatePublishStatus(params) {
  return request({
    url: `${BASE_PATH}/update/publishStatus`,
    method: 'post',
    params: params
  })
}


export function createProduct(data) {
  return request({
    url: `${BASE_PATH}/create`,
    method: 'post',
    data: data
  })
}

export function updateProduct(id, data) {
  return request({
    url: `${BASE_PATH}/update/` + id,
    method: 'post',
    data: data
  })
}

export function getProduct(id) {
  return request({
    url: `${BASE_PATH}/updateInfo/` + id,
    method: 'get',
  })
}


export function import1688Product(data) {
  return request({
    url: `${BASE_PATH}/import/1688`,
    method: 'post',
    data: data,
  })
}

export function selectProductByOrderId(ids) {
  return request({
    url: `${BASE_PATH}/list/customerOrder/${ids}`,
    method: 'get',
  })
}

export function putOnShelf(ids) {
  return request({
    url: `${BASE_PATH}/putOnShelf/${ids}`,
    method: 'post',
  })
}
export function stopProduction(ids, del) {
  return request({
    url: `${BASE_PATH}/stopProduction/${ids}`,
    method: 'post',
    params: { 'del': del }
  })
}