import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间 15s
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
    * code为非200是抛错 可结合自己业务进行修改
    */
    const res = response.data
    if (res.code !== 200 && res.code != null) {
      // 显示提示消息，停留3s
      Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000    //停留3s
      })

      // 401:未登录;
      if (res.code === 401) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      // 403:无权限;
      if (res.code === 403) {
        MessageBox.confirm('您尚无此操作权限，请联系管理员', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject(res.message || 'error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

export function ajax(method, url, params) {
  return new Promise((resolve, reject) => {
    // 创建XMLHttpRequest对象
    var xhr = null;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // 状态改变时的回调
    xhr.onreadystatechange = function () {
      // readyState为4的时候已接收完毕
      if (xhr.readyState === 4) {
        // 状态码200表示成功
        if (xhr.status === 200) {
          console.log(xhr);
          resolve(xhr.responseText);
        } else {
          reject(xhr.status);
        }
      }
    };

    // get
    if (method === 'get' || method === 'GET') {
      // 若是原始的URLSearchParams，直接转换成string
      if (params instanceof URLSearchParams) {
        params = params.toString();
      } else if (typeof params === 'object') {
        // params拆解成字符串
        params = Object.keys(params).map(function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
      } else {
        console.error('不支持的params格式 params: {}', typeof (params), params);
        return;
      }
      url = params ? url + '?' + params : url;
      console.log(url);
      xhr.open(method, url, true);
      xhr.send();
    }

    //post
    if (method === 'post' || method === 'POST') {
      xhr.open(method, url, true);
      if (params instanceof FormData) {
        xhr.send(params);
      } else {
        xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
        xhr.send(JSON.stringify(params));
      }
    }
  });
}
