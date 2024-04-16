import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Nav.css'


function Navbar() {
  const navigate = useNavigate();
  
  return (
    <nav className='nav' role='navigation' aria-label='Main Navigation'>
      <div className='logo' onClick={() => navigate('/home')} role='button'>
        <span className='app'>Sparkl  </span>
      </div>
      <div className='linkButton' role='menubar'>
        <button role='menuitem' onClick={() => navigate('/home')}> Home</button>
        <button role='menuitem' onClick={() => navigate('/bookshelf')}> Bookshelf</button>
        <button role='menuitem' onClick={() => navigate('/watchlist')}> Watchlist</button>
        <button role='menuitem' onClick={() => navigate('/blogs')}> Blogs</button>
        <button role='menuitem'> Profile</button>
      </div>
    </nav>
  );
}

export default Navbar;
