import React from 'react'

import ContactDetails from '../components/core/contactUsPage/ContactDetails'
import ContactForm from '../components/core/contactUsPage/ContactForm'
import Footer from '../components/common/Footer'

const Contact = () => {
    return (
        <div>
            <div className='mx-auto w-11/12 max-w-maxContent mt-20 flex flex-col justify-between gap-10 text-white lg:flex-row'>
                <div className='lg:w-[40%]'>
                    <ContactDetails />
                </div>
                <div className='lg:w-[60%]'>
                    <ContactForm />
                </div>
            </div>

            <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                {/* Reviews from Other Learner */}
                <h1 className="text-center text-4xl font-semibold mt-8">
                    Reviews from other learners
                </h1>
                {/* <ReviewSlider /> */}
            </div>

            <Footer />

        </div>
    )
}

export default Contact