import React, { useState, useEffect } from 'react'
import './Category.less'
import { Card, Button, Table, Spin } from 'antd';
import request from '../../api/ajax'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
function Category() {
  const [category, setCategory] = useState([])
  const [parentId, setParentId] = useState('0')
  const [isLoading, setisLoading] = useState(true)
  const [parentName, setParentName] = useState('')
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
    setParentName(category.name)
  }
  const goBack = () => {
    setParentId('0')
    setisLoading(true)
    setParentName('')

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
      <Card title={
        parentId === '0' ? "一级分类列表" :
          <div className='category-back'>
            <Button onClick={goBack} type="link" className='category-back-btn'>一级分类列表</Button><ArrowRightOutlined />{`${parentName}`}
          </div>
      }
        className='category'
        extra={<Button className='add-btn' type='primary'>
          <PlusOutlined />添加
      </Button>}
      >
        <Table
          bordered className='table'
          dataSource={category} columns={columns}
          pagination={{ defaultPageSize: 5 }}
        />
      </Card>
  )
}

export default Category;