import React, { useState } from 'react'
import "../Styles/Register.css"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function RegistrationPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

 
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('https://sparkl.onrender.com/user/register', { name, email, password });
  
      navigate('/login');
    } catch (error) {   
      console.error(error);
    }
 };
 const loginWithGoogle = () => {
  window.open('https://sparkl.onrender.com/auth/google/callback', '_self');
}

  return (
    <div className='RegisterPage'>
      <h3>Welcome to Sparkl</h3>
      <h2>Registration</h2>
      <form className='RegisterForm' onSubmit={handleRegister}>

        <div>
          <button className='googleBtn' onClick={loginWithGoogle}>CONTINUE WITH GOOGLE </button>
        </div>
        <div>
          <label> Username : </label>
          <input type="text" placeholder='Enter your username' onChange={(e) => setName(e.target.value)}/>
        
          <label htmlFor="email">Email : </label>
          <input type="email" placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} />
        
          <label htmlFor="password">Password : </label>
          <input type="password" placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)}/>
        
          <button type='submit'>Register</button>
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
