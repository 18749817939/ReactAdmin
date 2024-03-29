import React, { useState, useEffect } from 'react'
import './Product.less'
import { NavLink } from 'react-router-dom'
import { request ,requestUrl} from '../../api/ajax'

import { useHistory } from 'react-router-dom'

import { Card, Button, Table, Spin, message, Form, Select, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
const { Option } = Select;
function ProductHome() {
  const [products, setProducts] = useState([])//用于在子分类中展示一级分类列表
  const [isLoading, setisLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(3)
  const [loading, setLoading] = useState(true)
  const [searchName, setSearchName] = useState('')
  const [searchType, setSearchType] = useState('productName')
  let history = useHistory()
  const getMap = (response) => {
    if (response.success) {
      const arr = response.data.map(item => {//此处也没有h在使用data包裹整个数据，数据直接存在response中
        const obj = {}
        obj.key = item.id
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
      setTotal(response.total)//此处也没有h在使用data包裹整个数据，数据直接存在response中
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
      if (searchType === 'productName') {
        response = await request(`${requestUrl}/product/searchByName/${searchName}/${pageNum}/3`)
      } else {
        response = await request(`${requestUrl}/product/searchByDesc/${searchName}/${pageNum}/3`)
      }
    } else {
      response = await request(`${requestUrl}/product/get/${pageSize}/${pageNum}`);
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
    const response = await request(`${requestUrl}/product/changeStatus/${product.key}`,
      { status: product.status === 1 ? 0 : 1 }, 'PUT')
    if (response.success) {//没有状态码
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
  const addupdata = () => {
      history.push('/home/product/addupdate')
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
          <NavLink to={{pathname:'/home/product/detail',state:product}} className='product-link'>
            详情
          </NavLink>
          <NavLink to={{pathname:'/home/product/addupdate',state:product}} className='product-link'>
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
          extra={<Button className='add-btn' type='primary' onClick={() => addupdata()}>
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
              showSizeChanger: false
            }}
            loading={loading}
          />
        </Card>
      </div>
  )
}

export default ProductHome;