import React, { useState } from 'react'
import "../Styles/Register.css"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function RegistrationPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

 
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_SERVER}/user/register`, { name, email, password });
  
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Unable to create account');
    }
 };
 const loginWithGoogle = () => {
  window.open(`${import.meta.env.VITE_SERVER}/auth/google`, '_self');
}

  return (
    <div className='RegisterPage'>
      <h3>Welcome to Sparkl</h3>
      <h2>Registration</h2>
      <form className='RegisterForm' onSubmit={handleRegister}>

        <div>
          <button type="button" className='googleBtn' onClick={loginWithGoogle}>CONTINUE WITH GOOGLE </button>
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
            <button type="button" className='loginBtn' onClick={() => navigate('/login')}>Login</button></p>

        </div>

      </form>
      <ToastContainer position="top-right" />
    </div>
  )
}

export default RegistrationPage
