import React from 'react'
import './LeftNav.less'
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom'
import storage from '../../utils/storage'
import { menuList } from '../../config/menuConfig'
const { SubMenu } = Menu;
function LeftNav() {
  const setTitle = (title, key,openkey = '') => {
    const titleObj = { name: 'title', title, key,openkey }
    storage.add(titleObj)
  }
  const getmenuList = (menulist) => {
    return menulist.map(item => {
      if (!item.children) {
        return <Menu.Item key={item.key} title={item.title} icon={item.icon}>
          <NavLink to={item.key} onClick={()=>{setTitle(item.title,item.key)}}>
            {
              item.title
            }
          </NavLink>
        </Menu.Item>
      } else {
        return <SubMenu key={item.key} icon={item.icon} title={item.title}>
          {
            item.children.map(itemc => {
              return <Menu.Item key={itemc.key} title={itemc.title} icon={itemc.icon}>
                <NavLink to={itemc.key} onClick={()=>{setTitle(itemc.title,itemc.key,item.key)}}>
                  {
                    // this.item.key
                    itemc.title
                  }
                </NavLink>
              </Menu.Item>
            })
          }
        </SubMenu>
      }
    })
  }
  return (
    <div className='left-nav'>
      <div className='left-nav-header'>
        <div className='header-logo'></div>
        <div className='item-name'>硅谷后台</div>
      </div>
      <div style={{ width: 200, height: '100%' }}>
        <Menu
          defaultSelectedKeys={
            storage.get('title') ? [`${storage.get('title').key}`] : ['/home/center']
          }
          defaultOpenKeys={
            storage.get('title')?[`${storage.get('title').openkey}`]:[]
          }
          mode="inline"
          theme="dark"
        >
          {
            getmenuList(menuList)
          }
        </Menu>
      </div>
    </div>
  )
}

export default LeftNav;