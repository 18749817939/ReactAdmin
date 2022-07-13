import React, { useState, useEffect } from 'react'
import './Product.less'
import { useHistory, Redirect, useLocation } from 'react-router-dom'
import { Card, List, Spin } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { request, requestUrl } from '../../api/ajax'

function Detail(props) {
  const [name, setName] = useState('')
  const [pname, setpname] = useState('')
  const [loading, setLoading] = useState(false)
  let history = useHistory()
  let location = useLocation()
  const product = location.state
  const productBack = () => {
    history.replace('/home/product/home')
  }
  //获取当前product的分类
  const getInfo = async () => {
    setLoading(true)
    const response = await request(`${requestUrl}/category/getById/${product.categoryId}`)
    setName(response.name)
    setpname(response.pname)
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
                <span className='detail-right'>{pname}{pname ? <ArrowRightOutlined /> : ''}{name}</span>
              </List.Item>
              <List.Item className='product-item-detail'>
                <div className='product-imgs'>
                  <div>商品图片：</div>
                  {
                    product.imgs.map(img =>
                      <img className='product-img'
                        key={img}
                        src={`http://123.56.75.70/upload/${img}`}
                        alt="img" />
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