import React, { useState, useEffect } from 'react'
import './Product.less'
import { useHistory, Redirect } from 'react-router-dom'
import { Card, List, Select, Spin } from 'antd'
import { ArrowLeftOutlined,ArrowRightOutlined } from '@ant-design/icons'
import request from '../../api/ajax'
const { Option } = Select;
function Detail(props) {
  const [name, setName] = useState('')
  const [Cname, setCname] = useState('')
  const [loading, setLoading] = useState(false)

  let history = useHistory()
  const { product } = props.location
  const productBack = () => {
    history.replace('/home/product/home')
  }
  const getInfo = async () => {
    setLoading(true)

    if (product.pCategoryId === '0') {
      const response = await request(`/manage/category/info`, { categoryId: product.categoryId })
      setName(response.name)
      console.log(name)

    } else {
      const response1 = await request(`/manage/category/info`, { categoryId: product.categoryId })
      const response2 = await request(`/manage/category/info`, { categoryId: product.pCategoryId })
      setName(response1.data.name)
      setCname(response2.data.name)
      console.log(response1.data.name)
      console.log(response2.data.name)
    }
    console.log(name)
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
              <span className='detail-right'>{name}<ArrowRightOutlined />{Cname}</span>
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