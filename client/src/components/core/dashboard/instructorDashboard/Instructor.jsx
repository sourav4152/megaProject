import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RingLoader } from 'react-spinners'
import { Link } from 'react-router'
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI'
import { getInstructorData } from '../../../../services/operations/profileAPI'
import InstructorChart from './InstructorChart'

const Instructor = () => {

    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const [loading, setLoading] = useState(false);
    const [instructorData, setInstructorData] = useState(null);
    const [courses, setCourse] = useState([]);


    useEffect(() => {
        const getCourseDataWithStats = async () => {
            setLoading(true)
            const instructorApiData = await getInstructorData(token)
            const result = await fetchInstructorCourses(token);

            // console.log("GetInstructorData:", instructorApiData);
            // console.log("Instructor Course:", result);


            if (instructorApiData) {
                setInstructorData(instructorApiData)
            }
            if (result) {
                setCourse(result)
            }
            setLoading(false)

        }
        getCourseDataWithStats();
    }, [token])

    const totalAmount = instructorData?.reduce(
        (acc, curr) => acc + curr.totalAmountGenerated,
        0
    )

    const totalStudents = instructorData?.reduce(
        (acc, curr) => acc + curr.totalStudentsEnrolled,
        0
    )

    return (
        <div>
            <div className='space-y-2' >
                <p className='text-richblack-5 text-2xl font-bold ' >Hi, {user.firstName} 👋 </p>
                <p className='text-richblack-200 font-medium ' >Let's start something new</p>
            </div>

            <div>
                {
                    loading ?
                        (
                            <div className='h-[calc(100vh-10rem)] grid place-items-center' >
                                <RingLoader
                                    color="#6E5503"
                                    size={100}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                />
                            </div>
                        )
                        : !instructorData || !courses.length ?
                            (
                                <div className='text-center mt-20 bg-richblack-800 px-6  py-20 rounded-md' >
                                    <p className='text-2xl font-bold text-richblack-5' >You have <span className='font-extrabold text-pink-50'>not</span> published any courses yet</p>
                                    <Link to={'/dashboard/add-course'} >
                                        <p className='mt-3  text-lg font-semibold text-yellow-50 underline' >Create a course</p>
                                    </Link>
                                </div>
                            )
                            :
                            (
                                <div>
                                    {/* Pie charts and Stats */}
                                    <div className='flex flex-col md:flex-row gap-5 my-10' >
                                        {/* Pie charts */}
                                        <div className='w-full' >
                                            {
                                                (totalAmount > 0 || totalStudents > 0)
                                                    ?
                                                    (
                                                        <div className='h-full' >
                                                            <InstructorChart courses={instructorData} />
                                                        </div>
                                                    )
                                                    :
                                                    (
                                                        <div className='bg-richblack-800 h-full  rounded-md p-6' >
                                                            <p className='text-lg text-richblack-5 font-bold' >Visualize</p>
                                                            <p className='mt-4 text-xl text-richblack-200 font-medium ' >Not Enough Data To Visualize</p>
                                                        </div>
                                                    )
                                            }
                                        </div>
                                        {/* Statistics */}
                                        <div className='min-h-fit min-w-[250px] rounded-md bg-richblack-800 p-6' >
                                            <p className='text-lg font-bold text-richblack-5' >Statistics</p>

                                            <div className='flex flex-col gap-4 mt-4 mb-4' >
                                                <div>
                                                    <p className='text-lg text-richblack-200' >Total Courses</p>
                                                    <p className='text-3xl font-semibold text-richblack-50' >{courses.length}</p>
                                                </div>

                                                <div>
                                                    <p className='text-lg text-richblack-200'>Total Students</p>
                                                    <p className='text-3xl font-semibold text-richblack-50'>{totalStudents}</p>
                                                </div>

                                                <div>
                                                    <p className='text-lg text-richblack-200'>Total Income</p>
                                                    <p className='text-3xl font-semibold text-richblack-50'>₹ {totalAmount}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Published Courses */}
                                    <div className='w-full rounded-md bg-richblack-800 p-6' >
                                        <div className='flex justify-between items-center' >
                                            <p className='text-richblack-5 text-lg font-bold' >Your Published Courses</p>
                                            <Link to={'/dashboard/my-courses'} >
                                                <div className=' text-yellow-50 text-xs font-semibold' >
                                                    View All
                                                </div>
                                            </Link>
                                        </div>

                                        <div className='flex flex-col md:flex-row gap-x-5 gap-y-7 my-4' >
                                            {
                                                courses.slice(0, 3).map((course, ind) => (
                                                    <div key={ind} className='w-full md:w-1/3' >
                                                        <img
                                                            src={course.thumbnail}
                                                            alt={course.courseName}
                                                            className='h-[200px] w-full rounded-md object-cover'
                                                        />

                                                        <p className='mt-3 text-sm font-medium text-richblack-50' > {course.courseName} </p>

                                                        <p className='mt-1 text-xs font-medium text-richblack-300' >{course.studentsEnrolled.length} students | ₹ {course.price}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                }
            </div>
        </div>
    )
}

export default Instructor