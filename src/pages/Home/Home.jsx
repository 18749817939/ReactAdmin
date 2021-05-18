import React from 'react'
import {connect} from 'react-redux'

import { mapStateToProps,mapDispatchToProps } from '../../redux/action'
function Home(props) {
  return (
    <div>
      Home{props.user.name}
      
    </div>
  )
}


export default connect(mapStateToProps,mapDispatchToProps)(Home)