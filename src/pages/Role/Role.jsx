import React, { useState, useEffect } from 'react'
import { Card, Button, Table, Spin, message, Modal, Form, Input, Select, Radio } from 'antd'
import request from '../../api/ajax'
import './Role.less'
function Role() {
  const [isLoading, setisLoading] = useState(true)//判断是否获取到hooks中的请求数据
  const [roles, setRoles] = useState()
  const [pageNum, setPageNum] = useState(1)
  const [total, setTotal] = useState()
  const [value, setValue] = useState(0);
  const getMap = (response) => {
    const arr = response.map(item => {
      const role = {}
      role.roleName = item.name
      role.authTime = item.authTime
      role.authName = item.authName
      role.createTime = item.createTime
      role.menus = item.menus
      role.key = item.id
      return role
    })
    setRoles(arr)
    setTotal(arr.length)
  }
  const getRoles = async () => {
    setisLoading(true)
    const response = await request('http://159.75.128.32:5000/api/role/getRoles')
    if (response.status === 0) {
      const roles = response.data
      getMap(roles)
    }
    setisLoading(false)
  }
  const onChange = e => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };
  const columns = [
    {
      width: '4%',
      title: '',
      render: (role) =>
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={role.key}></Radio>
        </Radio.Group>
    },
    {
      width: '20%',
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName'
    },
    {
      width: '28%',
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      width: '28%',
      title: '授权时间',
      dataIndex: 'authTime',
      key: 'authTime'
    },
    {
      width: '20%',
      title: '授权人',
      dataIndex: 'authName',
      key: 'authName'
    },
  ]
  useEffect(() => {
    setTimeout(() => {
      getRoles()
    }, 500)
  }, [])
  return (
    isLoading ? <div className='spin'>
      <Spin size="large" className='spin' />
    </div> :
      <div className='role-container'>
        <Card
          title={
            <span className='role-btns'>
              <Button type='primary' style={{ marginRight: '8px' }}>创建角色</Button>
              <Button type='primary' disabled={!value}>设置角色权限</Button>
            </span>
          }
          className='role'
        >
          <Table
            bordered className='table'
            dataSource={roles}
            columns={columns}
            pagination={{
              total,
              defaultPageSize: 3,
              onChange: (pageNum) => setPageNum(pageNum),
              defaultCurrent: pageNum,
              showSizeChanger: false
            }}
          />
        </Card>
      </div>
  )
}

export default Role;