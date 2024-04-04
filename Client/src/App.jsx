import './App.css'
import {Route, Routes} from 'react-router-dom'

import WelcomePage from './components/WelcomePage'
import RegistrationPage from './components/AuthPages/RegistrationPage'
import LoginPage from './components/AuthPages/LoginPage'
function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/register' element={<RegistrationPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </>
  )
}

export default App
