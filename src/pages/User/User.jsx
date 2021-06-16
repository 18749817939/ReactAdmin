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
  const [products, setProducts] = useState([])//用于在子分类中展示一级分类列表
  const [isLoading, setisLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [loading, setLoading] = useState(true)
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
        obj.role = item.role_id
        return obj
      })
      setTotal(response.data.total)
      setProducts(arr)
      setisLoading(false)
      setLoading(false)
    } else {
      message.error('获取列表失败')
    }
  }
  const getProducts = async () => {
    setLoading(true)
    const response = await request(`/manage/user/list?&pageSize=3`);
    getMap(response)
  }
  const toDetail = (product = '') => {
    if (product) {
      storage.add(product, 'product')
    } else {
      history.push('/home/product/addupdate')
    }
  }
  useEffect(() => {
    setTimeout(() => {
      getProducts()
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
      dataIndex: 'role',
      key: 'role',
    },
    {
      width: '19%',
      title: '操作',
      render: (product) =>
        <div>
          <NavLink to='/home/product/detail' onClick={() => toDetail(product)} className='product-link'>
            详情
          </NavLink>
          <NavLink to='/home/product/addupdate' onClick={() => toDetail(product)} className='product-link'>
            修改
          </NavLink>
        </div>
    },
  ];

  return (
    isLoading ? <div className='spin'>
      <Spin size="large" className='spin' />
    </div> :
      <div className='product-container'>
        <Card title={
            <Button type='primary' >创建用户</Button>
        }
          className='product'
        >
          <Table
            bordered className='table'
            dataSource={products} columns={columns}
            pagination={{
              total, defaultPageSize: 3,
              onChange: (pageNum) => setPageNum(pageNum),
              defaultCurrent: pageNum,
              showSizeChanger:false
            }}
            loading={loading}
          />
        </Card>
      </div>
  )
}


export default User;