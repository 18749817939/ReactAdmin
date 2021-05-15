import React, { Component } from 'react'
import {Button} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Login from '../src/pages/Login/Login'
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
      <Button type='primary'>123</Button>
        <UserOutlined className="site-form-item-icon" />
        <LockOutlined className="site-form-item-icon" />
        <Login></Login>
      </>
    );
  }
}

export default app;