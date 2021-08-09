import React, { useState, useEffect } from 'react'
import './User.less'
import getTime from '../../utils/getTime'
import request from '../../api/ajax'
import { Card, Button, Table, Spin, message, Modal, Form, Input, Select } from 'antd'
import storage from '../../utils/storage'
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
  const [user_id, setUser_id] = useState()//修改时用的id
  const [form] = Form.useForm()
  const getId = storage.get('user').username
  const getMap = (response) => {
    // if (response.status === 0) {
    // const arr = response.data.users.map(item => {//没有status
    const arr = response.map(item => {
      const obj = {}
      // obj.key = item._id
      // obj.username = item.username
      // obj.role_id = item.role_id
      // obj.creatTime = getTime(new Date(item.create_time))
      obj.key = item.id
      obj.username = item.name
      obj.email = item.email
      obj.phone = item.phone
      obj.creatTime = item.createTime
      obj.role_id = item.roleId
      return obj
    })
    // //查找当前登录的用户对应的role_id，并存在localStorage中，这里默认所有的用户名都是唯一的，但这里实际上不是，因此查找时默认为找的第一个
    // const id = arr.find(item => 
    //   item.username === getId
    // )
    // storage.remove('role_id')
    // setTotal(response.data.total)
    setTotal(response.length)
    setUsers(arr)
    setisLoading(false)
    // } else {
    //   message.error('获取列表失败')
    // }
  }
  //获取列表并对格式进行处理存放在hooks中供后期使用
  const getUsers = async () => {
    setisLoading(true)
    // const response = await request(`/manage/user/list`)
    const response = await request(`http://159.75.128.32:5000/api/user/getUsers`)
    const responseRole = await request('http://159.75.128.32:5000/api/role/getRoles')
    const roles = responseRole.data
    // const { roles } = response.data
    // if (response.status === 0) {
    const roleNames = roles.reduce((pre, role) => {
      // pre[role._id] = role.name ? role.name : ""//这里使用了每个id作为对象的属性名，因为每个id都是唯一的，因此使用[]
      pre[role.id] = role.name ? role.name : ""
      return pre
    }, [])
    // const options = roles.map(role => ({ _id: role._id, name: role.name }))
    const options = roles.map(role => ({ _id: role.id, name: role.name }))
    setOptions(options)
    setRoles(roleNames)
    getMap(response)
    // } else {
    //   message.error("获取角色列表失败")
    // }
  }
  const onFinish = async (values) => {
    // const creat_time = Date.now()
    // const user = user_id ? { ...values, _id: user_id } : { ...values, creat_time }//这里没有creat_time属性也可以请求成功，可能是因为后台自动创建了一个时间
    // const response = await request(`/manage/user/${isModalVisible === 1 ? 'add' : 'update'}`, user, "POST")
    console.log(values)
    const value = { name: values.username, email: values.email, phone: values.phone, roleId: values.role_id }
    const creat_time = Date.now()
    const user = user_id ? { ...value, id: user_id } : { ...value, password: values.password }
    const response = await request(`http://159.75.128.32:5000/api/user/${isModalVisible === 1 ? 'add' : `update/${user_id}`}`,
      user, isModalVisible === 1 ?'post':'PUT')
    // if (response.status === 0) {
    if (response === 'success') {
      message.success(`添加成功`)
      setTimeout(() => {
        getUsers()
      }, 500)
    } else {
      message.error(`${user_id ? `修改失败` : `添加失败:${response.msg}`}`)
    }
    form.resetFields()//每次都清除form表单中的数据
    setUser_id()
    setIsModalVisible(0)
  }
  const showModal = (user = '') => {
    if (user) {
      setUser_id(user.key)
      //From下的Item以及各个Input等表单数据在命名name属性后就会变为受控组件，进而不能使用ini以及default
      //等初始值属性动态设置默认值，只能使用form下的一些方法，比如setFieldsValue
      form.setFieldsValue({ 'username': user.username, 'phone': user.phone, 'email': user.email, 'role_id': roles[user.role_id] })
      setIsModalVisible(2)
    } else {
      setIsModalVisible(1)//1表示添加，2表示修改
    }
  }
  const handleCancel = () => {
    setUser_id()
    form.resetFields()
    setIsModalVisible(0)
  }
  const deleteUser = (user) => {
    Modal.confirm({
      title: '删除吗？？？？',
      onOk: async () => {
        const response = await request(`http://159.75.128.32:5000/api/user/delete/${user.key}`, {}, 'DELETE')
        // const response = await request('/manage/user/delete', { userId: user.key }, 'post')
        // if (response.status === 0) {
        if (response) {
          message.success(`删除成功`)
          setTimeout(() => {
            getUsers()
          }, 200)
        } else {
          message.error(`删除失败`)
        }
      }
    })
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
          <Button className='user-link' onClick={() => deleteUser(user)} type='link' >删除</Button>
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
              showSizeChanger: false//去掉底部的每页显示数量的选择器
            }}
          />
        </Card>
        <Modal title="创建用户" visible={isModalVisible === 0 ? false : true}
          onCancel={handleCancel} footer={null}
        >
          <Form labelCol={{ span: 4 }} onFinish={onFinish} form={form}>
            <Form.Item
              label="用户名："
              className='user-username'
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input 用户名!',
                },
              ]}
            >
              <Input style={{ width: '230px' }} placeholder='请输入用户名'></Input>
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
                  // 会自动获取key和value，没有value时会自动获取key，因此使用key即可作为表单收集的value
                  options.map(item => <Option key={item._id}>
                    {
                      item.name
                    }
                  </Option>)
                }
              </Select>
            </Form.Item>
            <Form.Item>
              <div className='user-btns'>
                <Button className='ok-btn' type="primary" htmlType="submit" >确认</Button>
                <Button className='no-btn' type="primary" htmlType="button" onClick={handleCancel} >取消</Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  )
}
export default User;