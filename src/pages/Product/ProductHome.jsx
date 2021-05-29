import React, { useState, useEffect } from 'react'
import './Product.less'
import request from '../../api/ajax'
import { Card, Button, Table, Spin, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
function ProductHome() {
  const [products, setProducts] = useState([])//用于在子分类中展示一级分类列表
  const [isLoading, setisLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [Loading, setLoading] = useState(true)
  const getProducts = async (pageNum) => {
    setLoading(true)
    const response = await request(`/manage/product/list?pageNum=${pageNum}&pageSize=3`);
    if (response.status === 0) {
      const arr = response.data.list.map(item => {
        const obj = {}
        obj.key = item._id
        obj.name = item.name
        obj.desc = item.desc
        obj.price = item.price
        obj.status = item.status
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
  const changeStatue = async (product) => {
    const response = await request('/manage/product/updateStatus',
      { productId: product.key, status: product.status === 1 ? 2 : 1 }, 'post')
    if (response.status === 0) {
      setTimeout(() => {
        getProducts(pageNum)
      }, 500)
    }else{
      message.error('更新失败')
    }
  }
  useEffect(() => {
    setTimeout(() => {
      getProducts(pageNum)
    }, 500)
  }, [pageNum])
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
            type="primary" onClick={() => changeStatue(product)}
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
    isLoading ? <div className='spin'>
      <Spin size="large" className='spin' />
    </div> :
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
            pagination={{ total,defaultPageSize: 3,
              onChange:(pageNum)=>setPageNum(pageNum),
              defaultCurrent:pageNum
            }}
            loading={Loading}
          />
        </Card>
      </div>
  )
}

export default ProductHome;