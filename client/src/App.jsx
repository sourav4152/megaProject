import React from 'react'
import { Route, Routes } from 'react-router'

import OpenRoute from './components/core/Auth/OpenRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './pages/UpdatePassword'

import Navbar from './components/common/Navbar'
import './App.css'


const App = () => {
  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>

      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='login'
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>} />

        <Route path='forgot-password'
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          } />
          
          <Route path='update-password/:id'
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          } />

      </Routes>


    </div>
  )
}

export default App
