import React, { Component } from 'react'
import { Button } from 'antd'
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
        {/* <Button type="primary">123</Button> */}
        
      </>
    );
  }
}

export default app;