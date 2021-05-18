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

const { SubMenu } = Menu;
function LeftNav() {
  return(
    <div className='left-nav'>
      <div className='left-nav-header'>
        <div className='header-logo'></div>
        <div className='item-name'>硅谷后台</div>
      </div>
      <div style={{ width: 200 }}>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            首页
          </Menu.Item>
          <SubMenu key="sub0" icon={<QrcodeOutlined />} title="商品">
            <Menu.Item key="5" icon={<UnorderedListOutlined />}>品类管理</Menu.Item>
            <Menu.Item key="6" icon={<ToolOutlined />}>商品管理</Menu.Item>
          </SubMenu>
          <Menu.Item key="2" icon={<UserOutlined />}>
            用户管理
          </Menu.Item>
          <Menu.Item key="3" icon={<SafetyOutlined />}>
            角色管理
          </Menu.Item>
          <SubMenu key="sub2" icon={<AreaChartOutlined />} title="图形图标">
            <Menu.Item key="9" icon={<BarChartOutlined />}>柱形图</Menu.Item>
            <Menu.Item key="11" icon={<LineChartOutlined />}>折线图</Menu.Item>
            <Menu.Item key="12" icon={<PieChartOutlined />}>饼图</Menu.Item>

            
          </SubMenu>
        </Menu>
      </div>
    </div>
  )
}

export default LeftNav;