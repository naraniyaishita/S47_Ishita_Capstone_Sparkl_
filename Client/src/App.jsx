import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import WelcomePage from './components/WelcomePage';
import RegistrationPage from './components/AuthPages/RegistrationPage';
import LoginPage from './components/AuthPages/LoginPage';
import HomePage from './components/HomePage';

import Blogs from './components/Pages/Blogs';
import Bookshelf from './components/Pages/Bookshelf';
import Watchlist from './components/Pages/Watchlist';
import Blog from './components/Pages/Blog';

const routes = [
  { path: '/', element: <WelcomePage /> },
  { path: '/register', element: <RegistrationPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/home', element: <HomePage /> },
  { path: '/blogs', element: <Blogs /> },
  { path: "/blogs/:id", element: <Blog /> },
  { path: '/bookshelf', element: <Bookshelf /> },
  { path: '/watchlist', element: <Watchlist /> },

];

function App() {
  return (
    
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>

  );
}

export default App;
