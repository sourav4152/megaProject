import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from 'react-hot-toast';

import { updateProfile } from '../../../../services/operations/settingAPI';
import IconBtn from '../../../common/IconBtn';


const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Transgender"];


const EditProfile = () => {

    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        // Set the default values for the form fields
        defaultValues: {
            firstName: user?.firstName,
            lastName: user?.lastName,
            dateOfBirth: user?.additionalDetails?.dateOfBirth?.split('T')[0] || '',
            gender: user?.additionalDetails?.gender || '',
            contactNumber: user?.additionalDetails?.contactNumber || '',
            about: user?.additionalDetails?.about || '',
        },
    });

    //  helper function to check for changes
    const isFormDataChanged = (currentData) => {
        // Handle the case where user.additionalDetails might be null
        const prevDetails = user?.additionalDetails || {};

        if (user.firstName !== currentData.firstName) return true;
        if (user.lastName !== currentData.lastName) return true;

        // Handle the date format for comparison
        const prevDateOfBirth = prevDetails.dateOfBirth?.split('T')[0] || '';
        if (prevDateOfBirth !== currentData.dateOfBirth) return true;

        if ((prevDetails.gender || '') !== currentData.gender) return true;
        if ((prevDetails.contactNumber || '') !== currentData.contactNumber) return true;
        if ((prevDetails.about || '') !== currentData.about) return true;

        return false;
    };

    const submitProfileForm = async (data) => {
        // Check for updates and exit early if none
        if (!isFormDataChanged(data)) {
            toast.error("No changes to save.");
            return;
        }

        try {
            setLoading(true);
            await dispatch(updateProfile(token, data, navigate));
        } catch (error) {
            console.log("ERROR MESSAGE - ", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(submitProfileForm)}>
                <div className='my-5 rounded-md border border-richblack-700 bg-richblack-800 py-8 px-5 md:px-12'>
                    <h1 className='text-lg mb-6 font-semibold text-richblack-5 uppercase tracking-wider'>Profile Information</h1>

                    <div className='flex flex-col gap-y-6'>
                        <div className='flex flex-col md:flex-row gap-5'>

                            <label className='w-full' >
                                <p className='label-style uppercase tracking-wider mb-1'>First Name <span className='text-pink-100'>*</span></p>
                                <input
                                    type='text'
                                    name='firstName'
                                    placeholder='Enter first name'
                                    defaultValue={user?.firstName}
                                    className='form-style w-full placeholder:uppercase placeholder:text-sm placeholder:tracking-wider'
                                    {...register('firstName', { required: true })}
                                />

                                {
                                    errors.firstName && <p className='input-error-style' >Please enter your first name</p>
                                }
                            </label>


                            <label className='w-full' >
                                <p className='label-style uppercase tracking-wider mb-1' >Last Name <span className='text-pink-100'>*</span></p>
                                <input
                                    type='text'
                                    name='lastName'
                                    placeholder='Enter last name'
                                    defaultValue={user?.lastName}
                                    className='form-style w-full placeholder:uppercase placeholder:text-sm placeholder:tracking-wider'
                                    {...register('lastName', { required: true })}
                                />

                                {
                                    errors.lastName && <p className='input-error-style' >Please enter your last name</p>
                                }
                            </label>
                        </div>

                        <div className='flex flex-col md:flex-row gap-5'>

                            <label className='w-full' >
                                <p className='label-style uppercase tracking-wider mb-1' >Date of Birth <span className='text-pink-100'>*</span></p>
                                <input
                                    type='date'
                                    name='dateOfBirth'
                                    max={new Date().toISOString().split('T')[0]}
                                    placeholder='Enter first name'
                                    defaultValue={user?.additionalDetails?.dateOfBirth?.split('T')[0]}
                                    className='form-style w-full '
                                    {...register('dateOfBirth', {
                                        required: {
                                            value: true,
                                            message: 'Please enter your Date of Birth'
                                        },
                                        max: {
                                            value: new Date().toISOString().split('T')[0],
                                            message: 'Date of Birth cannot be in the future'
                                        }
                                    })}
                                />

                                {
                                    errors.dateOfBirth && <p className='input-error-style' >{errors.dateOfBirth.message}</p>
                                }
                            </label>


                            <label className='w-full' >
                                <p className='label-style uppercase tracking-wider mb-1' >Gender <span className='text-pink-100'>*</span></p>
                                <select
                                    type='text'
                                    name='gender'
                                    className='form-style w-full'
                                    defaultValue={user?.additionalDetails?.gender}
                                    {...register('gender', { required: true })}
                                >

                                    {
                                        genders.map((gender, ind) => (
                                            <option className='text-richblack-5' key={ind} value={gender} > {gender} </option>
                                        ))
                                    }
                                </select>
                            </label>
                        </div>

                        <div className='flex flex-col md:flex-row gap-5'>

                            <label className='w-full' >
                                <p className='label-style uppercase tracking-wider mb-1' >Contact Number <span className='text-pink-100'>*</span></p>
                                <input
                                    type='tel'
                                    name='contactNumber'
                                    placeholder='Enter contact number'
                                    defaultValue={user?.additionalDetails?.contactNumber}
                                    className='form-style w-full placeholder:uppercase placeholder:text-sm placeholder:tracking-wider'
                                    {...register('contactNumber', {
                                        required: {
                                            value: true,
                                            message: 'Please enter your Contact Number'
                                        },
                                        maxLength: {
                                            value: 12,
                                            message: 'Invalid Contact Number'
                                        },
                                        minLength: {
                                            value: 10,
                                            message: 'Invalid Contact Number'
                                        }
                                    })}
                                />

                                {
                                    errors.contactNumber && <p className='input-error-style' >{errors.contactNumber.message}</p>
                                }
                            </label>


                            <label className='w-full' >
                                <p className='label-style uppercase tracking-wider mb-1' >About <span className='text-pink-100'>*</span></p>
                                <input
                                    type='text'
                                    name='about'
                                    placeholder='Enter Bio Detail'
                                    defaultValue={user?.additionalDetails?.about}
                                    className='form-style w-full placeholder:uppercase placeholder:text-sm placeholder:tracking-wider'
                                    {...register('about', { required: true })}
                                />

                                {
                                    errors.about && <p className='input-error-style' >Please enter your Bio Details</p>
                                }
                            </label>
                        </div>
                    </div>

                </div>


                <div className='flex justify-end gap-2'>
                    <button onClick={() => navigate('/dashboard/my-profile')} className={`rounded-md bg-richblack-700 lg:py-2 py-1 lg:px-5 px-2 font-semibold text-richblack-50 uppercase tracking-wider 
          ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}>Cancel</button>

                    <IconBtn type={'submit'} disabled={loading} text={loading ? 'Saving...' : 'Save'} customClasses='lg:py-2 lg:px-5' />
                </div>

            </form>

        </div>
    )
}

export default EditProfile