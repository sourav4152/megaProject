import React, { useState } from 'react';
import { Link } from 'react-router'; // Assuming you're using React Router
import { RiDropdownList } from 'react-icons/ri';
import { VscSignIn, VscAccount } from 'react-icons/vsc'; // Icons for Login and Signup

export default function AuthDropdown() {
    // State to manage the visibility of the dropdown menu
    const [open, setOpen] = useState(false);

    return (
        <div className="relative md:hidden">
            {/* The dropdown trigger area, similar to the profile image and arrow */}
            <div 
                className="flex items-center gap-x-1 cursor-pointer"
                onClick={() => setOpen(prev => !prev)}
            >
                {/* I've used a placeholder div for a consistent look with the image */}
                <div className="aspect-square w-[30px] rounded-full flex items-center justify-center bg-richblack-700 text-richblack-5">
                    <VscAccount className="text-xl" />
                </div>
            </div>

            {/* Conditionally rendered dropdown menu with styling from your reference */}
            {open && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800"
                >
                    {/* Login Link */}
                    <Link to="/login" onClick={() => setOpen(false)}>
                        <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
                            <VscSignIn className="text-lg" />
                            Login
                        </div>
                    </Link>

                    {/* Signup Link */}
                    <Link to="/signup" onClick={() => setOpen(false)}>
                        <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
                            <VscAccount className="text-lg" />
                            <p>SignUp</p>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}
