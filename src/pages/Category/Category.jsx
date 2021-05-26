import React, { useState, useEffect } from 'react'
import './Category.less'
import { Card, Button, Select, Table, Spin, message, Modal, Input, Form } from 'antd';
import request from '../../api/ajax'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
const { Option } = Select;
function Category() {
  const [category, setCategory] = useState([])//用于在子分类中展示一级分类列表
  const [parentId, setParentId] = useState('0')//发送请求的ID
  const [isLoading, setisLoading] = useState(true)
  const [parentName, setParentName] = useState('')//显示当前子分类中的名字
  const [categoryId, setcategoryId] = useState('')//添加或修改时传递的需要添加或者修改的id
  const [categoryName, setcategoryName] = useState('')//添加或修改时传递的需要添加或者修改的名字
  const [isModalVisible, setIsModalVisible] = useState(0);
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
  //查看子分类，即修改parentId为当前分类的key，进而使用hooks自动发送请求
  const showCategory = (category) => {
    setParentId(category.key)
    setisLoading(true)
    setParentName(category.name)
  }
  //返回一级分类列表
  const goBack = () => {
    setParentId('0')
    setisLoading(true)
    setParentName('')
  }
  //添加或修改界面，1表示修改，2表示添加
  const showModal = (category = '') => {
    if (category) {
      //获取需要修改的分类的id和name
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
  //获取当前选择的option中的key属性，即当前选择的分类的parentid
  const onSelect = (key) => {
    setcategoryId(key)
  }
  //为1表示修改，为2表示添加
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
      //categoryId为空时表示没有触发onSelect，即选择了默认option，此处为判断是否选择了默认option
      //若为默认opytion则表示添加一级分类，parentId为0，否则parentId为所选分类的key，之后根据对应的
      //的parentId发送请求
      setcategoryId(categoryId ? categoryId : '0')
      const response = await request('/manage/category/add',
        { parentId: parentName ? parentId : categoryId, categoryName }, 'post');
      if (response.status === 0) {
        setTimeout(() => {
          get(parentId)
        }, 500)
        message.success('添加成功')
        setcategoryName('')
        setcategoryId('')
      } else {
        message.error('添加失败')
      }
    }
    setIsModalVisible(0);
  };
  const handleCancel = () => {
    setcategoryName('')
    setcategoryId('')
    setIsModalVisible(0);
  };
  //监听parentID，parentID发生改变就立即发送请求获取列表
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
    // 判断是否正在获取列表信息
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
            {/* 判断当前所处位置，若为分类首页，添加时显示分类选择，若在一级分类内，添加时不显示，即直接添加到该分类中 */}
            {!parentName ?
              <div>
                <div className='category-span'>所属分类</div>
                <Form.Item>
                  <Select defaultValue="一级分类" onSelect={onSelect}>
                    <Option key='0'>一级分类</Option>
                    {
                      category.map(item => <Option key={item.key}>
                        {
                          item.name
                        }
                      </Option>)
                    }
                  </Select>
                </Form.Item>
              </div>
              : ''
            }
            <div className='category-span'>分类名称</div>
            <Form.Item>
              <Input onChange={onChange} value={categoryName} placeholder='placeholder'></Input>
            </Form.Item>

          </Form>
        </Modal>
      </div>
  )
}

export default Category;