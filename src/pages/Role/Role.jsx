import React, { useState,} from 'react'
import './Role.less'
function Role() {
  const [num,setNum] = useState(1)
  const onClick = ()=>{
    setNum(num+1)
  }
  return(
    <div>
      <div>{num}</div>
      <button onClick={onClick}>+</button>
    </div>
  )
}

export default Role;