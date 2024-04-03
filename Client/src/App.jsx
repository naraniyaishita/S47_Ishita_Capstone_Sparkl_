import React from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom'

import WelcomePage from './components/WelcomePage'
function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
      </Routes>
    </>
  )
}

export default App
