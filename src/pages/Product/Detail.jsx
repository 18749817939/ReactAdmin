import React from 'react'
import './Product.less'
import { useHistory } from 'react-router-dom'
import { Card, Avatar, Button, List, Spin, message, Form, Select, Input } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
const { Option } = Select;
function Detail(props) {
  let history = useHistory()
  const { product } = props.location
  console.log(product)
  return (
    product ?
      <div className='detail-container'>
        <Card title={
          <span>
            <ArrowLeftOutlined style={{ color: '#1DA57A' }} />
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
              <span className='detail-right'>{product.name}</span>
            </List.Item>
            <List.Item className='product-item-detail'>
              商品图片：
              <span className='detail-right'>{product.imgs}</span>
            </List.Item>
            <List.Item className='product-item-detail'>
              商品详情：
              <span className='detail-right' dangerouslySetInnerHTML={{__html:product.detail}}></span>
            </List.Item>
          </List>
        </Card>
      </div>
      : history.replace('/home/product/home')
  )
}

export default Detail;