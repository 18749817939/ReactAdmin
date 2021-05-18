import React from 'react'
import { useHistory, Redirect } from 'react-router-dom'
import './Login.less'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Form, Input, Button, message } from 'antd'
import request from '../../api/ajax'
import storage from '../../utils/storage'
// import {connect} from 'react-redux'
// import { mapStateToProps,mapDispatchToProps } from '../../redux/action'
function Login(props) {
  let history = useHistory()
  const onFinish = async (values) => {
    const { username, password } = values
    const response = await request('/login', { username, password }, "POST")
    const data = response.data
    if (data.status === 0) {
      const user = { ...values, name: 'user' }
      storage.add(user)
      history.push('/home')
      message.success('登陆成功')
    } else {
      message.error(data.msg)
    }
  }
  return (
    !storage.get('user')?
    <div className="login">
      <div className='login-header'>
        <div className='icon-login-logo'></div>
        <div className='item-descirbe'>react项目：后台管理系统</div>
      </div>
      <div className='user'>
        <div className='user-login'>用户登录</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名！' },
              { min: 4, message: '用户名长度不得小于4！' },
              { max: 12, message: '用户名长度不得超过12！' },
              { pattern: /^[\w]+$/, message: '用户名只能包含任意数字、字母、下划线！' }
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码！' },
              { min: 4, message: '密码长度不得小于4！' },
              { max: 12, message: '密码长度不得超过12！' },
              { pattern: /^[\w]+$/, message: '密码只能包含任意数字、字母、下划线！' }
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
    :<Redirect to='/home' />
  )
}

export default Login