import React from 'react'

import { user, localStorage} from '../../utils/index'
function Home() {
  const admin = localStorage.getUser()
  console.log(admin)
  return (
    <div>
      {
        console.log(admin)

      }
      Home{admin.username}{admin.password}
      
    </div>
  )
}

export default Home;