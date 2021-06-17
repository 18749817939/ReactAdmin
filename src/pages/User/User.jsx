import React, { useState, useEffect } from 'react'
import './User.less'
import getTime from '../../utils/getTime'
import { NavLink } from 'react-router-dom'
import request from '../../api/ajax'
import { useHistory } from 'react-router-dom'
import { Card, Button, Table, Spin, message } from 'antd'
// import { PlusOutlined } from '@ant-design/icons'
import storage from '../../utils/storage'
function User() {
  const [users, setUsers] = useState([])
  const [isLoading, setisLoading] = useState(true)//判断是否获取到hooks中的请求数据
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [roles, setRoles] = useState({})
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
    const response = await request(`/manage/user/list?&pageSize=3`)
    const { roles, users } = response.data
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name ? role.name : ""
      return pre
    }, [])
    setRoles(roleNames)
    getMap(response)
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
        <div>
          <Button type='link' >详情</Button>
          <Button type='link' >修改</Button>
        </div>
    },
  ];
  return (
    isLoading ? <div className='spin'>
      <Spin size="large" className='spin' />
    </div> :
      <div className='user-container'>
        <Card title={
          <Button type='primary' >创建用户</Button>
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
      </div>
  )
}
export default User;