import React, { Component } from 'react'
import {BrowserRouter} from 'react-router-dom'
import Login from '../src/pages/Login/Login'
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
      <BrowserRouter>
      <Login ></Login>

      </BrowserRouter>
      </>
    );
  }
}

export default app;