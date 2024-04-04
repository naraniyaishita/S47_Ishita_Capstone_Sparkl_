import './App.css'
import {Route, Routes} from 'react-router-dom'

import WelcomePage from './components/WelcomePage'
import RegistrationPage from './components/AuthPages/RegistrationPage'
function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/register' element={<RegistrationPage />} />
      </Routes>
    </>
  )
}

export default App
