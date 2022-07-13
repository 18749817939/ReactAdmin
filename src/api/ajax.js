// 统一处理请求异常
import axios from 'axios'
import {message} from 'antd'
export const request = (url, data = {}, type = 'GET') => {
  return new Promise((resolve,reject)=>{
    let promise
    if (type === 'GET') {
      promise = axios.get(url, {
        params: data
      })
    } else if(type === 'PUT'){
      promise = axios.put(url, data)
    }else if(type === 'DELETE'){
      promise = axios.delete(url)
    }else {
      promise = axios.post(url, data)
    }
    promise.then(response=>{
      resolve(response.data)
    }).catch(error=>{
      message.error(`请求出错：${error.message}`)
    })
  })
}
export const requestUrl = `http://123.56.75.70:3008/admin`
