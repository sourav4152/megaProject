import React from 'react'

import Instructor from '../../../assets/Image/Instructor.png'

import { FaArrowRight } from 'react-icons/fa'
import HighlightText from './HighlightText'
import CTAButton from './Button'

const InstructorSection = () => {
    return (
        <>
            <div className="flex flex-col lg:flex-row gap-20 items-center">
                <div className="lg:w-[50%]">
                    <img
                        src={Instructor}
                        alt=""
                        className="shadow-white shadow-[-20px_-20px_0_0]"
                    />
                </div>
                <div className="lg:w-[50%] flex gap-10 flex-col">
                    <h1 className="lg:w-[50%] text-4xl font-semibold ">
                        Become an
                        <HighlightText text={"instructor"} />
                    </h1>

                    <p className="font-medium text-[16px] text-justify w-[90%] text-richblack-300">
                        Instructors from around the world teach millions of students on
                        StudyNotion. We provide the tools and skills to teach what you
                        love.
                    </p>

                    <div className="w-fit">
                        <CTAButton active={true} linkTo={"/signup"}>
                            <div className="flex items-center gap-3">
                                Start Teaching Today
                                <FaArrowRight />
                            </div>
                        </CTAButton>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InstructorSection