import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import CountryCode from '../../../data/countrycode.json';

import { useForm } from 'react-hook-form';
import { apiConnector } from '../../../services/apiconnector';
import { contactUsEndpoint } from '../../../services/apis';


const ContactUsForm = () => {

    // State variables
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful }
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            message: "",
            phoneNo: "",
            countrycode: "+91"
        },
    });

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);

    const submitContactForm = async (data) => {
        console.log("Form Data:", data);
        try {
            setLoading(true);
            const response = await apiConnector("POST", contactUsEndpoint.CONTACT_US_API, data);
            toast.success(response?.data?.message);

        } catch (error) {
            console.error("CONTACT FORM API ERROR:", error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <form
            className="flex flex-col gap-7"
            onSubmit={handleSubmit(submitContactForm)}
        >

            {/* name inputs */}
            <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="firstName" className="label-style">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="Enter first name"
                        className="form-style"
                        autoComplete="given-name"
                        {...register("firstName", { required: true })}
                    />
                    {errors.firstName && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter your first name.
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="lastName" className="label-style">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Enter last name"
                        className="form-style"
                        autoComplete="family-name"
                        {...register("lastName")}
                    />
                </div>
            </div>

            {/* email */}
            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="label-style">
                    Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email address"
                    className="form-style"
                    autoComplete="email"
                    {...register("email", { required: true })}
                />
                {errors.email && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        Please enter your Email address.
                    </span>
                )}
            </div>

            {/* phone number */}
            <div className="flex flex-col gap-2">
                <label htmlFor="phoneNo" className="label-style"> {/* Changed htmlFor from "phoneNumber" to "phoneNo" */}
                    Phone Number
                </label>

                <div className="flex gap-5">
                    <div className="flex w-[81px] flex-col gap-2">
                        <select
                            name="countrycode"
                            id="countryCode"
                            className="form-style"
                            autoComplete="tel-country-code"
                            {...register("countrycode", { required: true })}
                        >
                            {CountryCode.map((ele, i) => {
                                return (
                                    <option key={i} value={ele.code}>
                                        {ele.code} -{ele.country}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                        <input
                            type="number"
                            name="phoneNo"
                            id="phoneNo"
                            placeholder="12345 67890"
                            className="form-style"
                            autoComplete="tel-national"
                            {...register("phoneNo", {
                                required: {
                                    value: true,
                                    message: "Please enter your Phone Number.",
                                },
                                maxLength: { value: 12, message: "Invalid Phone Number" },
                                minLength: { value: 10, message: "Invalid Phone Number" },
                            })}
                        />
                    </div>
                </div>
                {errors.phoneNo && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        {errors.phoneNo.message}
                    </span>
                )}
            </div>

            {/* message input */}

            <div className="flex flex-col gap-2">
                
                <label htmlFor="message" className="label-style">
                    Message
                </label>
                <textarea
                    name="message"
                    id="message"
                    cols="30"
                    rows="7"
                    placeholder="Enter your message here"
                    className="form-style"
                    autoComplete="off"
                    {...register("message", { required: true })}
                />
                {errors.message && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        Please enter your Message.
                    </span>
                )}
            </div>

            {/* button */}
            <button
                disabled={loading}
                type="submit"
                className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
          ${!loading &&
                    "transition-all duration-200 hover:scale-95 hover:shadow-none"
                    }  disabled:bg-richblack-500 sm:text-[16px] `}
            >
                Send Message
            </button>
        </form>
    );
};

export default ContactUsForm;
