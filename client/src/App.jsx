import React from 'react'
import { Route, Routes } from 'react-router'

import OpenRoute from './components/core/Auth/OpenRoute'
import PrivateRoute from './components/core/Auth/PrivateRoute'
// import ACCOUNT_TYPE  from './utils/constants'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import About from './pages/About'
import Contact from './pages/Contact'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './pages/UpdatePassword'
import VerifyEmail from './pages/VerifyEmail'
import DashBoard from './pages/DashBoard'

import Navbar from './components/common/Navbar'
import MyProfile from './components/core/dashboard/MyProfile'
import Settings from './components/core/dashboard/settings/index'
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

        <Route path='signup'
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          } />

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

        <Route path='verify-email'
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        <Route path='about'
          element={
            // <OpenRoute>
            <About />
            //  </OpenRoute>
          } />

        <Route path='contact'
          element={
            // <OpenRoute>
            <Contact />
            // </OpenRoute>
          } />

        <Route
          element={
            <PrivateRoute>
              <DashBoard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile/>} />
          <Route path="dashboard/Settings" element={<Settings />} />
        </Route>

      </Routes>


    </div>
  )
}

export default App
