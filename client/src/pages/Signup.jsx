
import { useEffect } from 'react'
import signupImg from '../assets/Image/signup.webp'
import Template from '../components/core/Auth/Template'

function Signup() {
  useEffect(() => {
    document.title = "StudyNotion-Signup"
  }, [])
  return (
    <Template
      title="Join the millions learning to code with StudyNotion for free"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup