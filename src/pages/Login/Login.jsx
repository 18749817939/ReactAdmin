import React from 'react'
import './Login.less'
import { Input, Tooltip, Icon } from 'antd'
function Login() {
  return (
    <div className="login">
      <div className='login-header'></div>
      <div className='user'>
        <div className='user-login'>用户登录</div>
        
      </div>
      <Icon type="home" />
    </div>
  )
}

export default Login;