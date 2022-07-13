import React, { useState, useEffect } from 'react'
import { Card, Button, Table, Spin,  Modal,Input,  Radio, Tree } from 'antd'
import {request,requestUrl} from '../../api/ajax'

import './Role.less'
import getTime from '../../utils/getTime'
import storage from '../../utils/storage'
function Role() {
  const [isLoading, setisLoading] = useState(true)//判断是否获取到hooks中的请求数据
  const [roles, setRoles] = useState([])
  const [pageNum, setPageNum] = useState(1)
  const [total, setTotal] = useState()
  const [value, setValue] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(0)
  const [roleName, setRoleName] = useState()
  const [expandedKeys, setExpandedKeys] = useState(['work']);
  const [checkedKeys, setCheckedKeys] = useState();
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const getMap = (response) => {
    const arr = response.map(item => {
      const role = {}
      role.roleName = item.roleName
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
    const response = await request(`${requestUrl}/role/get`)
    if (response.success) {
      const roles = response.data
      getMap(roles)
    }
    setisLoading(false)
  }
  const onChange = async(e)=> {
    setValue(e.target.value)
    const responseRole = await request(`${requestUrl}/role/get/${e.target.value}`)
    const menus = responseRole.data[0].menus
    setCheckedKeys(menus)
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
  const handleOk = async() => {
    const authTime = getTime(new Date())
    const response = await request(`${requestUrl}/role/updata`,{id:value,menus:checkedKeys,authTime:authTime},"POST")
    if(response.success){
      setTimeout(() => {
        getRoles()
      }, 500)
      setIsModalVisible(0)
      setRoleName();
    }else{
      alert('修改失败')
    }
  }
  const creatByName = async() => {
    // 创建角色接口
    const authName = storage.get('user').user
    const createTime = getTime(new Date())
    const response = await request(`${requestUrl}/role/addRole`,{roleName,authName,createTime},"POST")
      if(response.success){
          getRoles()
      }
    setIsModalVisible(0)
    setRoleName();
  }
  const roleNameChange = e => {
    setRoleName(e.target.value);
  };
  const onExpand = (expandedKeysValue) => {
    // console.log('onExpand', expandedKeysValue); 
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
  const onCheck = (checkedKeys, info) => {
    // console.log('onCheck', checkedKeys);
    setCheckedKeys(checkedKeys)
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
            checkedKeys={checkedKeys}
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