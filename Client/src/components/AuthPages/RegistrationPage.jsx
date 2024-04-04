import React from 'react'
import "../Styles/Register.css"
import { useNavigate } from 'react-router-dom'

function RegistrationPage() {
  const navigate = useNavigate()
  return (
    <div className='RegisterPage'>
    <h3>Welcome to Sparkl</h3>
    <form className='RegisterForm'>

      <div>
        <button className='googleBtn'>CONTINUE WITH GOOGLE </button>
      </div>
      <div>
        <label> Username : </label>
        <input type="text" placeholder='Enter your username' />
      
        <label htmlFor="email">Email : </label>
        <input type="email" placeholder='Enter your email' />
      
        <label htmlFor="password">Password : </label>
        <input type="password" placeholder='Enter your password' />
      
        <button type='submit' onClick={() => navigate('/login ')}>Register</button>
      </div>
      <div>
        <p>Already have an account?
          <button className='loginBtn' onClick={() => navigate('/login')}>Login</button></p>
      </div>

    </form>
  </div>
  )
}

export default RegistrationPage
