import './App.css'
import {Route, Routes} from 'react-router-dom'

import WelcomePage from './components/WelcomePage'
import RegistrationPage from './components/AuthPages/RegistrationPage'
import LoginPage from './components/AuthPages/LoginPage'
import HomePage from './components/HomePage'

import Blogs from './components/Pages/Blogs'
import Bookshelf from './components/Pages/Bookshelf'
import Watchlist from './components/Pages/Watchlist'
function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/register' element={<RegistrationPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/bookshelf' element={<Bookshelf />} />
        <Route path='/watchlist' element={<Watchlist />} />
      </Routes>
    </>
  )
}

export default App
