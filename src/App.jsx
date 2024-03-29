import React, { Component } from 'react'
import { BrowserRouter, Route, Switch,Redirect } from 'react-router-dom'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
// import {connect} from 'react-redux'
// import { mapStateToProps,mapDispatchToProps} from './redux/action'
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <>
        <BrowserRouter>
          <Switch>
            <Route path='/login' component={Login}></Route>
            <Route path='/home' component={Home}></Route>
            <Redirect to='/login'></Redirect>          
          </Switch>
        </BrowserRouter>
      </>
    );
  }
}
export default app