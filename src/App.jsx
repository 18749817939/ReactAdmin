import React, { Component } from 'react'
import Login from '../src/pages/Login/Login'
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <Login></Login>
      </>
    );
  }
}

export default app;