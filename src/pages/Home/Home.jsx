import React from 'react'
// import {connect} from 'react-redux'
// import { mapStateToProps,mapDispatchToProps } from '../../redux/action'
import storage from '../../utils/storage'
import './Home.less'
import { Redirect } from 'react-router-dom'
import { Layout } from 'antd'
import Header from '../../components/Header/Header'
import LeftNav from '../../components/LeftNav/LeftNav'
const { Footer, Sider, Content } = Layout;
function Home(props) {
  const user = storage.get('user')
  return (
    user ?
      <Layout style={{ height: "100%" }}>
        <Sider>
          <LeftNav></LeftNav>
        </Sider>
        <Layout className='header-context-footer'>
          <Header></Header>
          <Content>Content</Content>
          <Footer className='footer'>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout>
      : <Redirect to='/login' />
  )
}


export default Home