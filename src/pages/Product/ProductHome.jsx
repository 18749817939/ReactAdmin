import React, { useState, useEffect } from 'react'
import './Product.less'
import { NavLink } from 'react-router-dom'
import request from '../../api/ajax'
import { useHistory } from 'react-router-dom'

import { Card, Button, Table, Spin, message, Form, Select, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import storage from '../../utils/storage'
const { Option } = Select;
function ProductHome() {
  const [products, setProducts] = useState([])//用于在子分类中展示一级分类列表
  const [isLoading, setisLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchName, setSearchName] = useState('')
  const [searchType, setSearchType] = useState('productName')
  let history = useHistory()

  // const [isSearch, setIsSearch] = useState(false)
  const getMap = (response) => {
    if (response.status === 0) {
      const arr = response.data.list.map(item => {
        const obj = {}
        obj.key = item._id
        obj.name = item.name
        obj.desc = item.desc
        obj.price = item.price
        obj.status = item.status
        obj.detail = item.detail
        obj.imgs = item.imgs
        obj.categoryId = item.categoryId
        obj.pCategoryId = item.pCategoryId
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
  const getProducts = async (pageNum) => {
    setLoading(true)
    let response
    if (searchName) {
      response = await request('/manage/product/search',
        { pageNum, pageSize: 3, [searchType]: searchName })
    } else {
      response = await request(`/manage/product/list?pageNum=${pageNum}&pageSize=3`);
    }
    getMap(response)
  }
  const onSearch = async () => {
    if (searchName) {
      if (pageNum === 1) {
        await setTimeout(() => {
          getProducts(pageNum)
        }, 500)
      } else {
        setPageNum(1)
      }
    } else {
      message.error('不能为空')
    }
  }
  const changeStatue = async (product) => {
    const response = await request('/manage/product/updateStatus',
      { productId: product.key, status: product.status === 1 ? 2 : 1 }, 'post')
    if (response.status === 0) {
      setTimeout(() => {
        getProducts(pageNum)
      }, 500)
    } else {
      message.error('更新失败')
    }
  }
  const changeSearchName = (e) => {
    setSearchName(e.target.value)
  }
  const onSelect = (key) => {
    setSearchType(key)
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
            style={{ backgroundColor: '#1DA57A' }}
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
          <Form className='product-title'>
            <Select onSelect={onSelect} defaultValue="按名称搜索" className='product-title-item'>
              <Option key='productName'>按名称搜索</Option>
              <Option key='productDesc'>按描述搜索</Option>
            </Select>
            <Input placeholder='关键字' value={searchName}
              className='product-title-input' onChange={changeSearchName}
            />
            <Button type='primary' onClick={onSearch}>搜索</Button>
          </Form>
        }
          className='product'
          extra={<Button className='add-btn' type='primary' onClick={() => toDetail()}>
            <PlusOutlined />添加商品
          </Button>}
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

export default ProductHome;