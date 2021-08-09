import React, { useState, useEffect } from 'react'
import { Card, Button, Table, Spin, message, Modal, Form, Input, Select, Radio, Tree } from 'antd'
import request from '../../api/ajax'
import './Role.less'
import axios from 'axios'
const { TreeNode } = Tree;
function Role() {
  const [isLoading, setisLoading] = useState(true)//判断是否获取到hooks中的请求数据
  const [roles, setRoles] = useState()
  const [pageNum, setPageNum] = useState(1)
  const [total, setTotal] = useState()
  const [value, setValue] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(0)
  const [roleName, setRoleName] = useState()
  const [menus, setMenus] = useState()
  const [expandedKeys, setExpandedKeys] = useState(['work']);
  // const [checkedKeys, setCheckedKeys] = useState(['0-0-0']);
  // const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const getMap = (response) => {
    const arr = response.map(item => {
      const role = {}
      role.roleName = item.name
      role.authTime = item.authTime
      role.authName = item.authName
      role.createTime = item.createTime
      role.menus = item.menus
      role.key = item.id
      return role
    })
    setRoles(arr)
    setTotal(arr.length)
  }
  const getRoles = async () => {
    setisLoading(true)
    const response = await request('http://159.75.128.32:5000/api/role/getRoles')
    if (response.status === 0) {
      const roles = response.data
      getMap(roles)
    }
    setisLoading(false)
  }
  const onChange = async(e)=> {
    setValue(e.target.value)
    const responseRole = await request(`http://159.75.128.32:5000/api/role/get/${e.target.value}`)
    const menus = responseRole.menus.split(',')
    setMenus(menus)
    console.log(e.target.value)
  };
  const createRole = () => {
    setIsModalVisible(1)
  }
  const modifyRole = () => {
    setIsModalVisible(2)
  }
  const handleCancel = () => {
    setIsModalVisible(0)
    setRoleName();
  }
  const handleOk = () => {
    setIsModalVisible(0)
    setRoleName();
  }
  const creatByName = async() => {
    // 创建角色接口
    const response = axios.post('http://159.75.128.32:5000/api/role/createRoleByName',roleName,{headers:{'content-type':'application/json'}})
    response.then((response)=>{
      console.log(response.data)
      if(response.data === 'success'){
          getRoles()
      }
    })
    setIsModalVisible(0)
    setRoleName();
  }
  const roleNameChange = e => {
    setRoleName(e.target.value);
  };
  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue); 
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const columns = [
    {
      width: '4%',
      title: '',
      render: (role) =>
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={role.key}></Radio>
        </Radio.Group>
    },
    {
      width: '20%',
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName'
    },
    {
      width: '28%',
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      width: '28%',
      title: '授权时间',
      dataIndex: 'authTime',
      key: 'authTime'
    },
    {
      width: '20%',
      title: '授权人',
      dataIndex: 'authName',
      key: 'authName'
    },
  ]
  const treeData = [
    {
      title: '平台权限',
      key: 'work',
      children: [
        {
          title: '首页',
          key: 'home',
        },
        {
          title: '商品',
          key: 'goods',
          children: [
            {
              title: '品类管理',
              key: 'category',
            },
            {
              title: '商品管理',
              key: 'product',
            },
          ],
        },
        {
          title: '用户管理',
          key: 'user',
        },
        {
          title: '角色管理',
          key: 'role',
        },
        {
          title: '图形图表',
          key: 'chart',
          children: [
            {
              title: '柱形图',
              key: 'chartCircle',
            },
            {
              title: '折线图',
              key: 'chartLine',
            },
            {
              title: '饼图',
              key: 'chartPillar',
            },
          ],
        },
      ],
    },
  ];
  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  const onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };
  useEffect(() => {
    setTimeout(() => {
      getRoles()
    }, 500)
  }, [])
  return (
    isLoading ? <div className='spin'>
      <Spin size="large" className='spin' />
    </div> :
      <div className='role-container'>
        <Card
          title={
            <span className='role-btns'>
              <Button type='primary' onClick={createRole} style={{ marginRight: '8px' }}>创建角色</Button>
              <Button type='primary' onClick={modifyRole} disabled={!value}>设置角色权限</Button>
            </span>
          }
          className='role'
        >
          <Table
            bordered className='table'
            dataSource={roles}
            columns={columns}
            pagination={{
              total,
              defaultPageSize: 3,
              onChange: (pageNum) => setPageNum(pageNum),
              defaultCurrent: pageNum,
              showSizeChanger: false
            }}
          />
        </Card>
        <Modal title="创建用户" visible={isModalVisible === 1 ? true : false}
          onCancel={handleCancel} onOk={creatByName}
        >
          <span>
            角色名称：<Input value={roleName} onChange={roleNameChange} style={{ width: '230px' }} placeholder='请输入角色名称'></Input>
          </span>
        </Modal>
        <Modal title="修改用户" visible={isModalVisible === 2 ? true : false}
          onCancel={handleCancel} onOk={handleOk}
        >
          <Tree
            checkable
            onExpand={onExpand}
            onSelect={onSelect}
            onCheck={onCheck}
            treeData={treeData}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
          />
        </Modal>
      </div>
  )
}

export default Role;