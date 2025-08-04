import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const RenderCartCourses = () => {

    const { cart } = useSelector((state) => state.cart)
    const dispatch = useDispatch();


    return (
        <div className='flex flex-1 flex-col'>
            {
                cart.map((course, index) => (

                    <div
                        key={course._id}
                        className={`flex w-full flex-wrap items-start justify-between gap-6 ${index !== cart.length - 1 && "border-b border-b-richblack-400 pb-6"
                            } ${index !== 0 && "mt-6"} `}>

                        <div className="flex flex-1 flex-col gap-4 xl:flex-row">
                            <img
                                src={course?.thumbnail}
                                alt={course?.courseName}
                                loading='lazy'
                                className="h-[148px] w-[220px] rounded-lg object-cover"
                            />
                            <div className='flex flex-col space-y-1'>
                                <p className="text-lg font-medium text-richblack-5">
                                    {course?.courseName}
                                </p>
                                <p className="text-sm text-richblack-300">
                                    {course?.category?.name}
                                </p>

                                
                            </div>

                        </div>

                    </div>
                ))
            }

        </div>
    )
}

export default RenderCartCourses