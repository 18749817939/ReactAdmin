import React, { useState, useEffect } from 'react'
import './Product.less'
import { useHistory, Redirect } from 'react-router-dom'
import { Card, List, Spin } from 'antd'
import { ArrowLeftOutlined,ArrowRightOutlined } from '@ant-design/icons'
import request from '../../api/ajax'
import storage from '../../utils/storage'
function Detail(props) {
  const [name, setName] = useState('')
  const [Cname, setCname] = useState('')
  const [loading, setLoading] = useState(false)
  let history = useHistory()
  const product = storage.get('product')
  const productBack = () => {
    history.replace('/home/product/home')
    storage.remove('product')
  }
  const getInfo = async () => {
    setLoading(true)
    if (product.pCategoryId === '0') {
      const response = await request(`/manage/category/info`, { categoryId: product.categoryId })
      setName(response.name)
    } else {
      const response1 = await request(`/manage/category/info`, { categoryId: product.categoryId })
      const response2 = await request(`/manage/category/info`, { categoryId: product.pCategoryId })
      setName(response1.data.name)
      setCname(response2.data.name)
    }
    setLoading(false)
  }
  useEffect(() => {
    product ?
      getInfo()
      : <Redirect to='/home/product/home'></Redirect>
  }, [])
  return (
    product ?
      loading ?
        <Spin size="large" className='spin' />
        : <div className='detail-container'>
          <Card title={
            <span>
              <ArrowLeftOutlined onClick={productBack} style={{ color: '#1DA57A' }} />
          &nbsp;&nbsp;商品详情
        </span>
          }
            className='detail'
          >
            <List>
              <List.Item className='product-item-detail'>
                商品名称：
              <span className='detail-right'>{product.name}</span>
              </List.Item>
              <List.Item className='product-item-detail'>
                商品描述：
              <span className='detail-right'>{product.desc}</span>
              </List.Item>
              <List.Item className='product-item-detail'>
                商品价格：
              <span className='detail-right'>{product.price}</span>
              </List.Item>
              <List.Item className='product-item-detail'>
                所属分类：
              <span className='detail-right'>{Cname}<ArrowRightOutlined />{name}</span>
              </List.Item>
              <List.Item className='product-item-detail'>
                <div className='product-imgs'>
                  <div>商品图片：</div>
                  {
                    product.imgs.map(img =>
                      img ?
                        <img className='product-img'
                          key={img}
                          src={`http://120.55.193.14:5000/upload/${img}`}
                          alt="img" /> : ''
                    )
                  }
                </div>
              </List.Item>
              <List.Item className='product-item-detail'>
                商品详情：
              <span className='detail-right' dangerouslySetInnerHTML={{ __html: product.detail }}></span>
              </List.Item>
            </List>
          </Card>
        </div>
      : <Redirect to='/home/product/home'></Redirect>
  )
}

export default Detail;