import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Styles/Loginfirst.css'

function Loginfirst() {
    const navigate = useNavigate();
  return (
    <main className="login-first" aria-labelledby="login-first-title">
      <div className="login-first-card">
        <p className="login-first-kicker">Your private space is waiting</p>
        <h1 id="login-first-title">Please log in first</h1>
        <p>Sign in to view your bookshelf, watchlist, and personal blogs.</p>
        <button onClick={() => navigate('/login')}>Login to Sparkl</button>
      </div>
    </main>
  )
}

export default Loginfirst
