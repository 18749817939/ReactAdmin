import React from 'react'
import { useHistory, Redirect } from 'react-router-dom'
import './Login.less'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Form, Input, Button, message } from 'antd'
import request from '../../api/ajax'
import storage from '../../utils/storage'
function Login(props) {
  let history = useHistory()
  const onFinish = async (values) => {
    const { username, password } = values
    // const response = await request('/login', { username, password }, "POST")
    const response = await request('http://159.75.128.32:5000/api/user/login', { name: username, password }, "POST")
    if (response.status === 0) {
      const response = await request(`http://159.75.128.32:5000/api/user/getUsers`)
      const arr = response.map(item => {
        const obj = {}
        obj.key = item.id
        obj.username = item.name
        obj.role_id = item.roleId
        return obj
      })
      const role = arr.find(item =>
        item.username === values.username
      )
      const responseRole = await request(`http://159.75.128.32:5000/api/role/get/${role.role_id}`)
      const roles = {authName:responseRole.authName,menus:responseRole.menus.split(','),id:responseRole.id}
      const user = { ...values, ...roles,name: 'user' }
      storage.add(user)
      history.push('/home')
      message.success('登陆成功')
    } else {
      message.error(response.msg)
    }
  }
  return (
    !storage.get('user') ?
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
                { min: 3, message: '用户名长度不得小于3！' },
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
                { min: 3, message: '密码长度不得小于3！' },
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
      : <Redirect to='/home' />
  )
}
export default Login