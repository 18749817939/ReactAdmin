import React from 'react'
import './LeftNav.less'
import { Menu } from 'antd';
import {
  HomeOutlined,
  QrcodeOutlined,
  UserOutlined,
  SafetyOutlined,
  AreaChartOutlined,
  UnorderedListOutlined,
  ToolOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { NavLink } from 'react-router-dom'
import storage from '../../utils/storage'

const { SubMenu } = Menu;
function LeftNav() {
  const getTitle = (title)=>{
    const titleObj = {name:'title',title}
    storage.add(titleObj)
  }
  return (
    <div className='left-nav'>
      <div className='left-nav-header'>
        <div className='header-logo'></div>
        <div className='item-name'>硅谷后台</div>
      </div>
      <div style={{ width: 200, height: '100%' }}>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
        >
          <Menu.Item key="1" title='首页' icon={<HomeOutlined />}>
            <NavLink to='/home/center' onClick={()=>{getTitle('首页')}}>
              首页
            </NavLink>
          </Menu.Item>
          <SubMenu key="sub0" icon={<QrcodeOutlined />} title="商品">
            <Menu.Item key="5" title='品类管理' icon={<UnorderedListOutlined />}>
              <NavLink to='/home/category' onClick={()=>{getTitle('品类管理')}}>
                品类管理
              </NavLink>
            </Menu.Item>
            <Menu.Item key="6" title='商品管理' icon={<ToolOutlined />}>
              <NavLink to='/home/product' onClick={()=>{getTitle('商品管理')}}>
                商品管理
              </NavLink>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="2" title='用户管理' icon={<UserOutlined />}>
            <NavLink to='/home/user' onClick={()=>{getTitle('用户管理')}}>
              用户管理
            </NavLink>
          </Menu.Item>
          <Menu.Item key="3" title='角色管理' icon={<SafetyOutlined />}>
            <NavLink to='/home/role' onClick={()=>{getTitle('角色管理')}}>
              角色管理
            </NavLink>
          </Menu.Item>
          <SubMenu key="sub2" icon={<AreaChartOutlined />} title="图形图标">
            <Menu.Item key="9" title='柱形图' icon={<BarChartOutlined />}>
              <NavLink to='/home/chartpillar' onClick={()=>{getTitle('柱形图')}}>
                柱形图
              </NavLink>
            </Menu.Item>
            <Menu.Item key="11" title='折线图' icon={<LineChartOutlined />}>
              <NavLink to='/home/chartline' onClick={()=>{getTitle('折线图')}}>
                折线图
              </NavLink>
            </Menu.Item>
            <Menu.Item key="12" title='饼图' icon={<PieChartOutlined />}>
              <NavLink to='/home/chartcircle' onClick={()=>{getTitle('饼图')}}>
                饼图
              </NavLink>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    </div>
  )
}

export default LeftNav;