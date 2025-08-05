import React from 'react'
import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import {RingLoader} from 'react-spinners'

import CoursesTable from './InstructorCourses/CoursesTable'
import { fetchInstructorCourses  } from '../../../services/operations/courseDetailsAPI'
import IconBtn from '../../common/IconBtn'

const MyCourses = () => {

    const { token } = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false)
    const [courses, setCourses] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true)
            const result = await fetchInstructorCourses(token);
            // console.log("MY Courses result:", result);
            
            if (result) { setCourses(result) }
            setLoading(false)
        }
        fetchCourse()
    }, [token])

    return (
        <div>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-14 gap-y-5' >
                <h1 className='text-3xl font-medium text-richblack-5 lg:text-left text-center uppercase tracking-wider' >My Courses</h1>
                <div className='hidden md:block'>
                    <IconBtn
                        type="btn"
                        text="Add Course"
                        customClasses="hidden md:block uppercase tracking-wider"
                        onClickHandler={() => navigate("/dashboard/add-course")}
                    >
                        <VscAdd />
                    </IconBtn>
                </div>


                <div className='md:hidden'>
                    <IconBtn
                        type="btn"
                        text="Add Course"
                        customClasses="w-full md:w-0 my-5 !py-1 text-center grid place-items-center uppercase tracking-wider"
                        onClickHandler={() => navigate("/dashboard/add-course")}
                    >
                        <VscAdd />
                    </IconBtn>
                </div>
            </div>
            {/* Second part */}
            <div >
                {
                    loading ?
                        (
                            <div className=' flex justify-center items-center w-full h-screen '>
                                <RingLoader
                                    color="#6E5503"
                                    size={100}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                />
                            </div>
                        )
                        :
                        !courses || courses.length === 0 ?
                            (
                                <div>
                                    <div className='h-[1px] mb-10  mx-auto bg-richblack-500' ></div>
                                    <p className='text-center text-2xl font-medium text-richblack-100 select-none' >No Courses Found</p>
                                </div>
                            )
                            :
                            <CoursesTable courses={courses} setCourses={setCourses} />
                }
            </div>


        </div>
    )
}

export default MyCourses