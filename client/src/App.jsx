/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router'

import OpenRoute from './components/core/Auth/OpenRoute'
import PrivateRoute from './components/core/Auth/PrivateRoute'


import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import About from './pages/About'
import Contact from './pages/Contact'
import Catalog from './pages/Catalog'
import CourseDetails from './pages/CourseDetails'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './pages/UpdatePassword'
import VerifyEmail from './pages/VerifyEmail'
import DashBoard from './pages/DashBoard'
import ViewCourse from './pages/ViewCourse'
import VideoDetails from './components/core/viewCourse/VideoDetails'
import EnrolledCourses from './components/core/dashboard/EnrolledCourses'
import Cart from './components/core/dashboard/cart/index'
import MyCourses from './components/core/dashboard/MyCourses'
import AddCourse from './components/core/dashboard/addCourse/index'
import EditCourse from './components/core/dashboard/editCourse'

import Navbar from './components/common/Navbar'
import MyProfile from './components/core/dashboard/MyProfile'
import Settings from './components/core/dashboard/settings/index'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'

import { ACCOUNT_TYPE } from './utils/constants'
import { getUserDetails } from './services/operations/profileAPI'
import Instructor from './components/core/dashboard/instructorDashboard/Instructor'

const App = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }
  }, [])

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

          <Route path="catalog/:catalogName" element={<Catalog />} />
          <Route path="courses/:courseId" element={<CourseDetails />} />

        <Route
          element={
            <PrivateRoute>
              <DashBoard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/Settings" element={<Settings />} />
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path='dashboard/enrolled-courses' element={<EnrolledCourses />} />
                <Route path="/dashboard/cart" element={<Cart />} />
              </>
            )
          }
          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/my-courses" element={<MyCourses />} />
                <Route path='dashboard/add-course' element={<AddCourse/>} />
                <Route path='dashboard/instructor' element={<Instructor/>}/>
                <Route path='dashboard/edit-course/:courseId' element={<EditCourse/>}/>
              </>
            )
          }

        </Route>

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
               
              />
            </>
          )}
        </Route>

      </Routes>


    </div>
  )
}

export default App
