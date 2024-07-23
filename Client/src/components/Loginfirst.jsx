import React from 'react'
import { useNavigate } from 'react-router-dom'
function Loginfirst() {
    const navigate = useNavigate();
  return (
    <h1 id="helloUser">PLEASE LOGIN FIRST <button onClick={() => navigate('/login')}>Login</button></h1>
  )
}

export default Loginfirst
