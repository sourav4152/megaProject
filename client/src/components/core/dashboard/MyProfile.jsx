import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

import { RiEditBoxLine } from 'react-icons/ri'

import IconBtn from '../../common/IconBtn'
import { formattedDate } from '../../../utils/dateFormatter'


const MyProfile = () => {

    const { user } = useSelector((state) => state.profile)
    const navigate = useNavigate();

    return (
        <div className='bg-richblack-900 text-white mx-0 md:mx-5'>
            <h1 className='font-medium text-richblack-5 text-3xl mb-7 md:mb-14' >My Profile</h1>

            {/* Section 1  */}
            <div className='flex items-center justify-between rounded-md border border-richblack-700 bg-richblack-800 p-8 px-3 md:px-12'>
                <div className='flex flex-row gap-x-2 md:gap-x-4 items-center' >
                    <div>
                        <img src={user?.image} alt={`profile-${user?.firstName}`} className='aspect-square w-[60px] md:w-[78px] rounded-full object-cover' />
                    </div>

                    <div className='space-y-1'>
                        <h2 className='text-lg font-semibold text-richblack-5' >{user?.firstName} {user?.lastName}</h2>
                        <p className='text-sm text-richblack-300'>{user?.email}</p>
                    </div>
                </div>

                <IconBtn customClasses={"hidden md:block"} text={'Edit'} onClickHandler={() => navigate('/dashboard/settings')} children={<RiEditBoxLine />} />
            </div>

            <div className='md:hidden'>
                <IconBtn
                    text={'Edit Profile'}
                    onClickHandler={() => navigate('/dashboard/settings')}
                    customClasses="w-full my-5 !py-1 text-center grid place-items-center"
                    children={<RiEditBoxLine />} />
            </div>

            {/* Section 2  */}
            <div className='flex flex-col gap-y-10 my-7 md:my-10 rounded-md border border-richblack-700 p-8 px-3 md:px-12 bg-richblack-800'>
                <div className='flex items-center justify-between' >
                    <h2 className='text-lg font-semibold text-richblack-5'>About</h2>
                    <IconBtn text={'Edit'} customClasses="hidden md:block" onClickHandler={() => navigate('/dashboard/settings')} children={<RiEditBoxLine />} />
                </div>
                <p className={`${user?.additionalDetails?.about ? 'text-richblack-5' : 'text-richblack-400'} text-sm font-medium`} >{user?.additionalDetails?.about || 'Write Something About Yourself'}</p>
            </div>

            {/* Section 3 */}
            <div className='flex flex-col gap-y-5 md:gap-y-10 rounded-md border border-richblack-700 p-8 px-3 md:px-12 bg-richblack-800 '>
                <div className='flex items-center justify-between w-full' >
                    <h2 className='text-lg font-semibold text-richblack-5' >Personal Details</h2>
                    <IconBtn text={'Edit'} customClasses="hidden md:block" onClickHandler={() => navigate('/dashboard/settings')} children={<RiEditBoxLine />} />
                </div>

                <div className='flex flex-col md:flex-row gap-y-5'>
                    <div className='w-full md:w-1/2'>
                        <p className='mb-2 text-sm text-richblack-600'>First Name</p>
                        <p className='text-sm text-richblack-5 font-medium' >{user?.firstName}</p>
                    </div>

                    <div className='w-full md:w-1/2'>
                        <p className='mb-2 text-sm text-richblack-600'>Last Name</p>
                        <p className='text-sm text-richblack-5 font-medium' >{user?.lastName}</p>
                    </div>
                </div>


                <div className='flex flex-col md:flex-row gap-y-5'>
                    <div className='w-full md:w-1/2'>
                        <p className='mb-2 text-sm text-richblack-600'>Email</p>
                        <p className='text-sm text-richblack-5 font-medium' >{user?.email}</p>
                    </div>

                    <div className='w-full md:w-1/2'>
                        <p className='mb-2 text-sm text-richblack-600'>Phone Number</p>
                        <p className={`text-sm font-medium ${user?.additionalDetails?.contactNumber ? 'text-richblack-5' : 'text-richblack-400'} `} >{user?.additionalDetails?.contactNumber ?? 'Add Contact Number'}</p>
                    </div>
                </div>


                <div className='flex flex-col md:flex-row gap-y-5'>
                    <div className='w-full md:w-1/2'>
                        <p className='mb-2 text-sm text-richblack-600'>Gender</p>
                        <p className={`text-sm font-medium ${user?.additionalDetails?.gender ? 'text-richblack-5' : 'text-richblack-400'} `} >{user?.additionalDetails?.gender ?? 'Add Gender'}</p>
                    </div>

                    <div className='w-full md:w-1/2'>
                        <p className='mb-2 text-sm text-richblack-600'>Date of Birth</p>
                        <p className={`text-sm font-medium ${user?.additionalDetails?.dateOfBirth ? 'text-richblack-5' : 'text-richblack-400'} `} >{user?.additionalDetails?.dateOfBirth ? formattedDate(user?.additionalDetails?.dateOfBirth) : 'Add Date of Birth'}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MyProfile