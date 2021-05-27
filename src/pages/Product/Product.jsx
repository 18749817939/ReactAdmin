import React from 'react'
import './Product.less'
import { Switch, Route, Redirect } from 'react-router-dom'
import AddUpdate from './AddUpdate'
import Home from './Home'
import Detail from './Detail'
function Product() {
  return (
    <div className='products'>
      <Switch>
        <Route path='/home/product/home' component={Home}></Route>
        <Route path='/home/product/addupdate' component={AddUpdate}></Route>
        <Route path='/home/product/detail' component={Detail}></Route>
        <Redirect to='/home/product/home'></Redirect>
      </Switch>
    </div>
  )
}
export default Product;