import React from 'react'
import { Link } from 'react-router'
import { FaArrowRight } from 'react-icons/fa'

import Banner from '../assets/Image/banner.mp4'

import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from '../components/core/HomePage/Button'
import CodeBlocks from '../components/core/HomePage/CodeBlocks'

const Home = () => {
    return (
        <div>
            {/* Section 1 */}
            <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">

                <Link to={"/signup"}>
                    <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
                        <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
                            <p>Become an Instructor</p>
                            <FaArrowRight />
                        </div>
                    </div>
                </Link>

                {/* Heading  */}
                <div className="text-center text-4xl font-semibold">
                    Empower Your Future with
                    <HighlightText text={"Coding Skills"} />
                </div>

                {/* Sub Heading */}
                <div className="-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300">
                    With our online coding courses, you can learn at your own pace, from
                    anywhere in the world, and get access to a wealth of resources,
                    including hands-on projects, quizzes, and personalized feedback from
                    instructors.
                </div>

                {/* CTA Buttons  */}
                <div className=' flex flex-row gap-7 mt-8'>
                    <CTAButton active={true} linkTo={'/signup'}>
                        Learn More
                    </CTAButton>
                    <CTAButton active={false} linkTo={'/login'}>
                        Book a Demo
                    </CTAButton>

                </div>

                {/* Banner video  */}
                <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
                    <video
                        className="shadow-[20px_20px_rgba(255,255,255)]"
                        muted
                        loop
                        autoPlay
                    >
                        <source src={Banner} type="video/mp4" />
                    </video>
                </div>


                {/* code Section 1  */}

                <div>
                    <CodeBlocks
                        position={"lg:flex-row"}
                        heading={
                            <div className="text-4xl font-semibold">
                                Unlock your
                                <HighlightText text={"coding potential"} /> with our online
                                courses.
                            </div>
                        }
                        subheading={
                            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                        }
                        ctaBtn1={{
                            btnText: "Try it Yourself",
                            link: "/signup",
                            active: true,
                        }}
                        ctaBtn2={{
                            btnText: "Learn More",
                            link: "/signup",
                            active: false,
                        }}
                        codeColor={"text-yellow-25"}
                        codeBlock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                        backgroundGradient={<div className="codeblock1 absolute"></div>}
                    />

                </div>

                {/* code Section 2 */}


            </div>


            {/* Section 2 */}

            {/* Section 3 */}

            {/* Footer */}

        </div>
    )
}

export default Home