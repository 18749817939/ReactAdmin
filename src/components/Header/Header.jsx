import React, { useEffect, useState } from 'react'
import storage from '../../utils/storage'
import './Header.less'
import getTime from '../../utils/getTime'
import { useHistory } from 'react-router-dom'
import {request} from '../../api/ajax'

import { FrownOutlined,ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal} from 'antd';
const { confirm } = Modal;
function Header() {
  let history = useHistory()
  const [weather, setWeather] = useState('雷阵雨加狂风之力')
  const [time, setTime] = useState(getTime(new Date()))
  const loginOut = () => {
    confirm({
      title: '确定退出吗?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: 'OK',
      cancelText: 'Cancel',
      onOk() {
        storage.removeAll()
        history.replace('/login')
      },
      onCancel() {
      },
    });
  }
  const getWeather = async () => {
    const response = await request('https://restapi.amap.com/v3/weather/weatherInfo?city=110108&key=abf2bd1766e851d8067f088e3080ad5c')
    setWeather(response.lives[0].weather)
  }
  useEffect(() => {
    const timer =  setInterval(() => {
      setTime(getTime(new Date()))
    }, 1000)
    getWeather()
    return ()=>{
      clearInterval(timer)
    }
  }, [])
  return (
    <div className='header'>
      <div className='headeer-top'>
        <div className='header-welcom'>
          欢迎 {storage.get('user').username}
        </div>
        <button onClick={loginOut} className='login-out-btn'>
          退出
      
        </button>
      </div>
      <div className='header-line'></div>
      <div className='header-bottom'>
        <div className='home-page'>
          {
            storage.get('title')?storage.get('title').title:'首页'
          }
        </div>
        <div className='time-weather'>
          <div className='time'>
            {time}
          </div>
          <div className='weather'>
            <FrownOutlined className='icon-weather' />{weather}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header;