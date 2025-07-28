import React from 'react'
import { Route,Routes } from 'react-router'

import Home from './pages/Home' 
import Login from './pages/Login'
import Navbar from './components/common/Navbar'
import './App.css'


const App = () => {
  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>}/>
      </Routes>

      
    </div>
  )
}

export default App
