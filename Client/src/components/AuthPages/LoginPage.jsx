import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
function LoginPage() {
    const navigate = useNavigate()
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:2004/user/login', { name, email, password });
        const { token, user } = response.data;
        console.log(token, user);

        navigate('/home');
      } catch (error) {
        console.error(error);
      }
   }; 

  return (
    <div className='RegisterPage'>
    <h3>Welcome to Sparkl</h3>
    <h2>Login</h2>
    <form className='RegisterForm' onSubmit={handleLogin}>
      <div>
        <button className='googleBtn'>CONTINUE WITH GOOGLE </button>
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
          <button className='RegisterBtn' onClick={() => navigate('/register')}>Register</button></p>
      </div>
    </form>
  </div>
  )
}

export default LoginPage
