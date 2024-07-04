import React, {useContext} from 'react'
import Navbar from './Navbar'
import UserContext from './User/UserContext'

function HomePage() {
  const {username} = useContext(UserContext)
  return (
    <div>
      <Navbar/>
      <h1 id='helloUser'>Hello, {username} </h1>
    </div>
  )
}

export default HomePage
