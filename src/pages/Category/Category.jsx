import React, { useState, useEffect } from 'react'
import './Category.less'
import { Card, Button, Select, Table, Spin, message, Modal, Input, Form } from 'antd';
import request from '../../api/ajax'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
const { Option } = Select;
function Category() {
  const [category, setCategory] = useState([])
  const [parentId, setParentId] = useState('0')
  const [isLoading, setisLoading] = useState(true)
  const [parentName, setParentName] = useState('')
  const [categoryId, setcategoryId] = useState('')
  const [categoryName, setcategoryName] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(0);
  const areas = [
    { label: 'Beijing', value: 'Beijing' },
    { label: 'Shanghai', value: 'Shanghai' },
  ];
  const get = async (parentId) => {
    setisLoading(true)
    const response = await request('/manage/category/list', { parentId });
    if (response.status === 0) {
      const arr = response.data.map(item => {
        const obj = {}
        obj.key = item._id
        obj.name = item.name
        obj.parentId = item.parentId
        return obj
      })
      setCategory(arr)
      setisLoading(false)
    } else {
      message.error('获取列表失败')
    }
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
  const showModal = (category = '') => {
    if (category) {
      setcategoryName(category.name)
      setcategoryId(category.key)
      setIsModalVisible(1)
    } else {
      setIsModalVisible(2)
    }
  }
  const onChange = (e) => {
    setcategoryName(e.target.value)
  }
  const handleOk = async () => {
    if (isModalVisible === 1) {
      const response = await request('/manage/category/update',
        { categoryId, categoryName }, 'post');
      if (response.status === 0) {
        setTimeout(() => {
          get(parentId)
        }, 500)
        message.success('修改成功')
        setcategoryId('')
      } else {
        message.error('修改失败')
      }
    } else {
      // const response = await request('/manage/category/add',
      //   { categoryId, categoryName }, 'post');
      // if (response.status === 0) {
      //   setTimeout(() => {
      //     get(parentId)
      //   }, 500)
      //   message.success('添加成功')
      //   setcategoryId('')
      // } else {
      //   message.error('添加失败')
      // }
      alert(12)
    }
    setIsModalVisible(0);
  };
  const handleCancel = () => {
    setcategoryName('')
    setcategoryId('')
    setIsModalVisible(0);
  };
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
          <Button onClick={() => showModal(category)}
            type="link" className='category-btn'>修改分类
          </Button>
          {
            parentId === '0' ?
              <Button onClick={() => showCategory(category)}
                type="link" className='category-btn'>查看子分类
            </Button> : ''
          }
        </span>
    }
  ];
  return (
    isLoading ? <div className='spin'>
      <Spin size="large" className='spin' />
    </div> :
      <div>
        <Card title={
          parentId === '0' ? "一级分类列表" :
            <div className='category-back'>
              <Button onClick={goBack} type="link"
                className='category-back-btn'>一级分类列表
            </Button><ArrowRightOutlined />{`${parentName}`}
            </div>
        }
          className='category'
          extra={<Button className='add-btn' onClick={() => showModal()} type='primary'>
            <PlusOutlined />添加
          </Button>}
        >
          <Table
            bordered className='table'
            dataSource={category} columns={columns}
            pagination={{ defaultPageSize: 3 }}
          />

        </Card>
        <Modal title="修改分类" visible={isModalVisible === 1 ? true : false}
          onOk={handleOk} onCancel={handleCancel}
        >
          <Form>
            <Form.Item>
              <Input onChange={onChange} value={categoryName} placeholder='placeholder'></Input>
            </Form.Item>
          </Form>
        </Modal>
        <Modal title="添加分类" visible={isModalVisible === 2 ? true : false}
          onOk={handleOk} onCancel={handleCancel}
        >
          <Form>
            <Form.Item>
              <Select>
                {
                  category.map(item=><Option value={item.name} key={item.key}>
                    {
                      item.name
                    }
                  </Option>)
                }
              </Select>
            </Form.Item>
            <Form.Item>
              <Input onChange={onChange} value={categoryName} placeholder='placeholder'></Input>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  )
}

export default Category;