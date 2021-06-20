import React, { useState, useEffect } from 'react'
import './User.less'
import getTime from '../../utils/getTime'
import request from '../../api/ajax'
import { Card, Button, Table, Spin, message, Modal, Form, Input, Select } from 'antd'
// import { PlusOutlined } from '@ant-design/icons'
const { Option } = Select;
function User() {
  const [users, setUsers] = useState([])
  const [isLoading, setisLoading] = useState(true)//判断是否获取到hooks中的请求数据
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [roles, setRoles] = useState({})
  const [options, setOptions] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(0);
  const [modalUser, setModalUser] = useState()
  const [form] = Form.useForm()
  const getMap = (response) => {
    if (response.status === 0) {
      const arr = response.data.users.map(item => {
        const obj = {}
        obj.key = item._id
        obj.username = item.username
        obj.email = item.email
        obj.phone = item.phone
        obj.creatTime = getTime(new Date(item.create_time))
        obj.role_id = item.role_id
        return obj
      })
      setTotal(response.data.total)
      setUsers(arr)
      setisLoading(false)
    } else {
      message.error('获取列表失败')
    }
  }
  //获取列表并对格式进行处理存放在hooks中供后期使用
  const getUsers = async () => {
    setisLoading(true)
    const response = await request(`/manage/user/list`)
    const { roles } = response.data
    if (response.status === 0) {
      const roleNames = roles.reduce((pre, role) => {
        pre[role._id] = role.name ? role.name : ""
        return pre
      }, [])
      const options = roles.map(role => ({ _id: role._id, name: role.name }))
      setOptions(options)
      setRoles(roleNames)
      getMap(response)
    } else {
      message.error("获取角色列表失败")
      // request('http://120.55.193.14:5000/manage/user/add'), user, "POST")
    }
  }
  const onFinish = async (values) => {
    console.log(values)
    const creat_time = Date.now()
    const user = { ...values, creat_time }//这里没有creat_time属性也可以请求成功，可能是因为后台自动创建了一个时间
    console.log(user)
    const response = await request(`/manage/user/${isModalVisible === 1 ? 'add' : 'update'}`, user, "POST")
    if (response.status === 0) {
      setTimeout(() => {
        getUsers()
      }, 500)
    } else {
      message.error(`'添加失败`)
    }
    form.resetFields()
    setIsModalVisible(0)
  }
  const showModal = (user = '') => {
    if (user) {
      console.log(user)
      setModalUser(user.username)
      setIsModalVisible(2)
    }else{
    setIsModalVisible(1)

    }
  }
  const handleCancel = () => {
    setIsModalVisible(0)
  }
  const onChange = (e) => {
    setModalUser(e.target.value)
  }
  useEffect(() => {
    setTimeout(() => {
      getUsers()
    }, 500)
  }, [])
  const columns = [
    {
      width: '14%',
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      width: '19%',
      title: '邮箱',
      dataIndex: 'email',
      key: 'email'
    },
    {
      width: '19%',
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      width: '19%',
      title: '注册时间',
      dataIndex: 'creatTime',
      key: 'creatTime',
    },
    {
      width: '14%',
      title: '所属角色',
      dataIndex: 'role_id',//用于和数据数组中的每一项属性进行绑定
      render: role_id => roles[role_id]

    },
    {
      width: '19%',
      title: '操作',
      render: (user) =>
        <div >
          <Button className='user-link' onClick={() => showModal(user)} type='link' >修改</Button>
          <Button className='user-link' type='link' >删除</Button>
        </div>
    },
  ];
  return (
    isLoading ? <div className='spin'>
      <Spin size="large" className='spin' />
    </div> :
      <div className='user-container'>
        <Card title={
          <Button type='primary' onClick={() => showModal()}>创建用户</Button>
        }
          className='user'
        >
          <Table
            bordered className='table'
            dataSource={users} columns={columns}
            pagination={{
              total, defaultPageSize: 3,
              onChange: (pageNum) => setPageNum(pageNum),
              defaultCurrent: pageNum,
              showSizeChanger: false
            }}
          />
        </Card>
        <Modal title="创建用户" visible={isModalVisible === 0 ? false : true}
          onCancel={handleCancel} footer={null}
        >
          <Form labelCol={{ span: 4 }} onFinish={onFinish} form={form}>
            <Form.Item
              label="用户名："
              className='user-username' name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input 用户名!',
                },
              ]}
            // initialValue={modalUser.username}
            >

              <Input onChange={onChange} value={modalUser} style={{ width: '230px' }} placeholder='请输入用户名' />
              <Input onChange={onChange} value={modalUser} style={{ width: '230px' }} placeholder='请输入用户名' />
            
            </Form.Item>
            {
              isModalVisible === 1 ? <Form.Item
                label="密码："
                className='user-password' name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input 密码!',
                  },
                ]}
              >
                <Input name="test1" style={{ width: '230px' }} placeholder="请输入密码" />
              </Form.Item> : ''
            }
            <Form.Item
              label="手机号："
              className='user-phone' name="phone"
            // initialValue={isModalVisible===2?storage.get('modalUser').phone:''}

            >
              <Input name="test1" style={{ width: '230px' }} placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item
              label="邮箱："
              className='user-email' name="email"
            >
              <Input name="test1" style={{ width: '230px' }} placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item
              label="角色："
              className='user-role' name="role_id"
            >
              <Select style={{ width: '230px' }}
                placeholder="请选择角色"
              >
                {
                  options.map(item => <Option key={item._id}>
                    {
                      item.name
                    }
                  </Option>)
                }
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit"  >确认</Button>
              <Button type="primary" htmlType="button" onClick={handleCancel} >取消</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  )
}
export default User;