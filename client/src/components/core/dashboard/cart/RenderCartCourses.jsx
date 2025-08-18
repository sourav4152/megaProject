import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactStars from "react-star-ratings"
import { FaStar } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'

import { removeFromCart } from '../../../../slices/cartSlice'
import { getAverageRatingsForCourses } from '../../../../services/operations/courseDetailsAPI'

const RenderCartCourses = () => {

    const { cart } = useSelector((state) => state.cart)
    const [averageRatings, setAverageRatings] = useState({});

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchRatings = async () => {
            if (cart.length > 0) {
                // Get the course IDs from the cart
                const courseIds = cart.map(course => course._id);
                // Call the reusable function by passing the course IDs
                const ratingsMap = await getAverageRatingsForCourses(courseIds);
                setAverageRatings(ratingsMap);
            }
        };

        fetchRatings();
    }, [cart]);

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

                                {
                                    averageRatings[course._id] !== undefined ?
                                        (<div className="flex items-center gap-2">
                                            <span className="text-yellow-5">{averageRatings[course._id].toFixed(1)}</span>
                                            <ReactStars
                                                count={5}
                                                rating={averageRatings[course._id]}
                                                edit={false}
                                                starRatedColor="#E7C000"
                                                starEmptyColor="#585D67"
                                                starDimension="20px"
                                                starSpacing="4px"
                                            />
                                            <span className="text-richblack-400">
                                                {course?.ratingAndReview?.length || 0} Ratings
                                            </span>

                                        </div>)
                                        :
                                        (<p>Loading ratings...</p>)
                                }

                            </div>

                        </div>

                        <div className="flex flex-col items-end space-y-2">
                            <button
                                onClick={() => dispatch(removeFromCart(course._id))}
                                className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200"
                            >
                                <RiDeleteBin6Line />
                                <span>Remove</span>
                            </button>
                            <p className="mb-6 text-3xl font-medium text-yellow-100">
                                ₹ {course?.price}
                            </p>
                        </div>

                    </div>
                ))
            }

        </div>
    )
}

export default RenderCartCourses