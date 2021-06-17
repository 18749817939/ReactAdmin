import React, { useState, useEffect } from 'react'
import './User.less'
import getTime from '../../utils/getTime'
import { NavLink } from 'react-router-dom'
import request from '../../api/ajax'
import { useHistory } from 'react-router-dom'
import { Card, Button, Table, Spin, message, Modal, Form, Input } from 'antd'
// import { PlusOutlined } from '@ant-design/icons'
import storage from '../../utils/storage'
function User() {
  const [users, setUsers] = useState([])
  const [isLoading, setisLoading] = useState(true)//判断是否获取到hooks中的请求数据
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [roles, setRoles] = useState({})
  const [isModalVisible, setIsModalVisible] = useState(0);

  let history = useHistory()
  const getMap = (response) => {
    if (response.status === 0) {
      const arr = response.data.users.map(item => {
        const obj = {}
        obj.key = item._id
        obj.username = item.username
        obj.email = item.email
        obj.phone = item.phone
        obj.creatTime = getTime(new Date(item.create_time))
        obj.role_id = item.role_id
        return obj
      })
      setTotal(response.data.total)
      setUsers(arr)
      setisLoading(false)
    } else {
      message.error('获取列表失败')
    }
  }
  const getUsers = async () => {
    const response = await request(`/manage/user/list`)
    const { roles, users } = response.data
    if (response.status === 0) {
      const roleNames = roles.reduce((pre, role) => {
        pre[role._id] = role.name ? role.name : ""
        return pre
      }, [])
      setRoles(roleNames)
      getMap(response)
    } else {
      message.error("获取角色列表失败")
      // request("http://120.55.193.14:5000/manage/user/" + (user._id ? 'update' : 'add'), user, "POST")
    }
  }
  const alterUser = () => {
    setIsModalVisible(2)
  }
  const addUser = () => {
    setIsModalVisible(1)
  }
  const handleOk = () => {
    setIsModalVisible(0)

  }
  const handleCancel = () => {
    setIsModalVisible(0)
  }
  useEffect(() => {
    setTimeout(() => {
      getUsers()
    }, 500)
  }, [])
  const columns = [
    {
      width: '14%',
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      width: '19%',
      title: '邮箱',
      dataIndex: 'email',
      key: 'email'
    },
    {
      width: '19%',
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      width: '19%',
      title: '注册时间',
      dataIndex: 'creatTime',
      key: 'creatTime',
    },
    {
      width: '14%',
      title: '所属角色',
      dataIndex: 'role_id',//用于和数据数组中的每一项属性进行绑定
      render: role_id => roles[role_id]

    },
    {
      width: '19%',
      title: '操作',
      render: (user) =>
        <div >
          <Button className='user-link' type='link' >修改</Button>
          <Button className='user-link' onClick={alterUser} type='link' >删除</Button>
        </div>
    },
  ];
  return (
    isLoading ? <div className='spin'>
      <Spin size="large" className='spin' />
    </div> :
      <div className='user-container'>
        <Card title={
          <Button type='primary' onClick={addUser}>创建用户</Button>
        }
          className='user'
        >
          <Table
            bordered className='table'
            dataSource={users} columns={columns}
            pagination={{
              total, defaultPageSize: 3,
              onChange: (pageNum) => setPageNum(pageNum),
              defaultCurrent: pageNum,
              showSizeChanger: false
            }}
          />
        </Card>
        <Modal title="创建用户" visible={isModalVisible != 0 ? true : false}
          onOk={handleOk} onCancel={handleCancel}
        >
          <Form labelCol={{span:4}}>
            <Form.Item
              label="用户名："
              className='addupdate-detail' name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input 用户名!',
                },
              ]}
            >
              <Input name="test1" style={{ width: '230px' }} placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              label="密码："
              className='addupdate-detail' name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input 密码!',
                },
              ]}
            >
              <Input name="test1" style={{ width: '230px' }} placeholder="请输入密码" />
            </Form.Item>
            <Form.Item
              label="手机号："
              className='addupdate-detail' name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input 手机号!',
                },
              ]}
            >
              <Input name="test1" style={{ width: '230px' }} placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item
              label="邮箱："
              className='addupdate-detail' name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input 邮箱!',
                },
              ]}
            >
              <Input name="test1" style={{ width: '230px' }} placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item
              label="角色："
              className='addupdate-detail' name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input 角色!',
                },
              ]}
            >
              <Input name="test1" style={{ width: '230px' }} placeholder="请输入角色" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
  )
}
export default User;