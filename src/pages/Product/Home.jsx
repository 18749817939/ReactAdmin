import React, { useState, useEffect } from 'react'
import './Product.less'
import request from '../../api/ajax'
import { Card, Button, Table } from 'antd'
import { ArrowRightOutlined, PlusOutlined } from '@ant-design/icons'
function Home() {
  const [products, setProducts] = useState([])//用于在子分类中展示一级分类列表

  const get = async (parentId) => {
    const response = await request(`/manage/product/list?pageNum=1&pageSize=12`);
    const arr = response.data.list.map(item => {
      const obj = {}
      obj.key = item.categoryId
      obj.name = item.name
      obj.desc = item.desc
      obj.price = item.price
      obj.status = item.status
      return obj
    })
    console.log(response.data.list)
    setProducts(arr)
  }
  useEffect(() => {
    setTimeout(() => {
      get()
    }, 500)
  }, [])
  const columns = [
    {
      width: '20%',
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      width: '56%',
      title: '商品描述',
      dataIndex: 'desc',
      key: 'desc'

    },
    {
      width: '8%',
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      width: '8%',
      title: '状态',
      render: (product) =>
        <div >
          <Button
            type="primary"
          >
            {
              product.status === 1 ? '下架' : '上架'
            }
          </Button>
          <div className='sale'>
            {
              product.status === 1 ? '在售' : '已下架'
            }
          </div>
        </div>
    },
    {
      width: '8%',
      title: '操作',
      render: (product) =>
        <div>
          <Button type="link" className='product-btn'>详情</Button>
          <Button type="link" className='product-btn'>修改</Button>
        </div>
    },
  ];
  return (
    <div className='product-container'>
      <Card title="一级分类列表"
        className='product'
        extra={<Button className='add-btn' type='primary'>
          <PlusOutlined />添加商品
          </Button>}
      >
        <Table
          bordered className='table'
          dataSource={products} columns={columns}
          pagination={{ defaultPageSize: 3 }}
        />

      </Card>
    </div>
  )
}

export default Home;