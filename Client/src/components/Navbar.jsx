import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Nav.css'

const pages = [
  { name: "Home", path: "/home" },
  { name: "Bookshelf", path: "/bookshelf" },
  { name: "Watchlist", path: "/watchlist" },
  { name: "Blogs", path: "/blogs" },
  { name: "About", path: "/about" }, 
];

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className='nav' role='navigation' aria-label='Main Navigation'>
      <div className='logo' onClick={() => navigate('/home')} role='button'>
        <span className='app'>Sparkl  </span>
      </div>
      <div className='linkButton' role='menubar'>
        {pages.map((page) => (
          <button key={page.name} role="menuitem" onClick={() => navigate(page.path)}>
            {page.name}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
