import { Message, MessageBox } from 'element-ui'

const ajax = function(method, url, params) {
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
                resolve(xhr.response);
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
            console.error('不支持的params格式 params: {}', typeof(params), params);
            // 显示提示消息，停留3s
            Message({
              message: res.message,
              type: 'error',
              duration: 3 * 1000    //停留3s
            })
            return;
          }
          url = params ? url + '?' + params : url;
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

export default ajax;
