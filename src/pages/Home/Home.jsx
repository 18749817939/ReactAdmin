import React from 'react'
import storage from '../../utils/storage'
import './Home.less'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Header from '../../components/Header/Header'
import LeftNav from '../../components/LeftNav/LeftNav'
import Center from '../Center/Center'
import Category from '../Category/Category'
import Product from '../Product/Product'
import ChartPillar from '../ChartPillar/ChartPillar'
import Role from '../Role/Role'
import User from '../User/User'
import ChartCircle from '../ChartCircle/ChartCircle'
import ChartLine from '../ChartLine/ChartLine'
const { Footer, Sider, Content } = Layout;
function Home(props) {
  const user = storage.get('user')
  const title = storage.get('title')
  return (
    user ?
      <Layout style={{ height: "100%" , width: "100%" }} >
        <Sider>
          <LeftNav></LeftNav>
        </Sider>
        <Layout className='header-context-footer'>
          <Header></Header>
          <Content className='context-container' style={{ margin:20,backgroundColor: "white"}}>
              <Switch>
                <Route path='/home/center' component={Center}></Route>
                <Route path='/home/category' component={Category}></Route>
                <Route path='/home/product' component={Product}></Route>
                <Route path='/home/chartpillar' component={ChartPillar}></Route>
                <Route path='/home/chartcircle' component={ChartCircle}></Route>
                <Route path='/home/chartline' component={ChartLine}></Route>
                <Route path='/home/role' component={Role}></Route>
                <Route path='/home/user' component={User}></Route>
                <Redirect to={title?title.key:'/home/center'}></Redirect>
              </Switch>
          </Content>
            <Footer className='footer'>
              推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
        </Layout>
      : <Redirect to='/login' />
  )
}


export default Home