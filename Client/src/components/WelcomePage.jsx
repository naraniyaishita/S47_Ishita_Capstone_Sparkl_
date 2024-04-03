import React from 'react'
import './Styles/Welcome.css'

function WelcomePage() {
  return (
    <div className='WelcomePage'>
    <p>
      Introducing <span className='appName'>Sparkl</span>  the all-in-one app designed to simplify your digital lifestyle.
      <br />
      Sparkl is your haven for digital organization, seamlessly bringing together your favorite applications,
      <br />
      entertainment preferences, and personal expressions in one centralized hub.
    </p>
    <button>Get Started ⭐ </button>
  </div>
  )
}

export default WelcomePage