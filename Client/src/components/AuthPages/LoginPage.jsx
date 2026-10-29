import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import UserContext from '../User/UserContext'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function LoginPage() {
    const navigate = useNavigate()
    const { setUserName, setUserEmail, setUserId, setToken } = useContext(UserContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/user/login`, { name, email, password });
        const { token, user } = response.data;
        sessionStorage.setItem('token', token);
        setToken(token);
        setUserName(user.name);
        setUserEmail(user.email);
        setUserId(user._id);

        navigate('/home');
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Invalid email or password');
      }
   }; 
   const loginWithGoogle = () => {
    window.open(`${import.meta.env.VITE_SERVER}/auth/google`, '_self');
    
 }

  return (
    <div className='RegisterPage'>
    <h3>Welcome to Sparkl</h3>
    <h2>Login</h2>
    <form className='RegisterForm' onSubmit={handleLogin}>
      <div>
        <button type="button" className='googleBtn' onClick={loginWithGoogle}>CONTINUE WITH GOOGLE </button>
      </div>
      <div>
        <label> Username : </label> 
        <input type="text" placeholder='Enter your username' value={name} onChange={(e) => setName(e.target.value)} />
        <label> Email : </label>
        <input type="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} />
      
        <label htmlFor="password">Password : </label>
        <input type="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
      
        <button type='submit'>Login</button>
      </div>
      <div>
        <p> Don't have an account?
          <button type="button" className='RegisterBtn' onClick={() => navigate('/register')}>Register</button></p>
      </div>
    </form>
    <ToastContainer position="top-right" />
  </div>
  )
}

export default LoginPage
