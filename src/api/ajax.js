import axios from 'axios'
const ajax = (url, data = {}, type = 'GET') => {
  try {
    if (type === 'GET') {
      return axios.get(url, {
        params: data
      })
    } else {
      return axios.post(url, data)
    }
  }catch(error){

  }
}
export default ajax;