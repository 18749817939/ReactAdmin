import React, { useState, useEffect } from 'react'
import './Category.less'
import { Card, Button, Table, Spin } from 'antd';
import request from '../../api/ajax'
import { PlusOutlined } from '@ant-design/icons'
function Category() {
  const [category, setCategory] = useState([])
  const [parentId, setParentId] = useState('0')
  const [isLoading, setisLoading] = useState(true)
  const get = async (parentId) => {
    const response = await request('/manage/category/list', { parentId });
    const arr = response.data.data.map(item => {
      const obj = {}
      obj.key = item._id
      obj.name = item.name
      obj.parentId = item.parentId
      return obj
    })
    setCategory(arr)
    setisLoading(false)

  }
  const showCategory = (category) => {
    setParentId(category.key)
    setisLoading(true)
  }
  useEffect(() => {
    setTimeout(() => {
      get(parentId)
    }, 500)
  }, [parentId])
  const columns = [
    {
      width: '70%',
      title: '分类',
      dataIndex: 'name',
      key: 'name',
    },
    {
      width: '30%',
      title: '操作',
      render: (category) =>
        <span>
          <Button type="link" className='category-btn'>修改分类</Button>
          {
            parentId === '0' ?
              <Button onClick={() => showCategory(category)} type="link" className='category-btn'>查看子分类</Button>
              : ''
          }
        </span>
    }
  ];
  return (
    isLoading ? <div className='spin'>
      <Spin size="large" className='spin' />
    </div> :
      <Card title="一级分类列表" className='category'
        extra={<Button className='add-btn' type='primary'>
          <PlusOutlined />添加
      </Button>}
      >
        <Table
          bordered className='table'
          dataSource={category} columns={columns}
          pagination={{ defaultPageSize: 3 }}
        />
      </Card>
  )
}

export default Category;