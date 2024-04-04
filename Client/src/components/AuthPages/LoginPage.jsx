import React from 'react'
import { useNavigate } from 'react-router-dom'
function LoginPage() {
    const navigate = useNavigate()
  return (
    <div className='RegisterPage'>
      <h3>Welcome to Sparkl</h3>
      <form className='RegisterForm' onSubmit={(e) => e.preventDefault()}>

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
        
          <button type='submit' onClick={() => navigate('/home')}>Login</button>
        </div>
        <div>

          <p>Don't have an account?
            <button className='RegisterBtn' onClick={() => navigate('/register')}>Register</button></p>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
