import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"

//make initialSate [] before completing
const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [

      {
            "_id": "6880df6f9515e27a9c7de7b9",
            "courseName": "Complete Web Development Bootcamp",
            "courseDescription": "Learn HTML, CSS, JS, Node.js, Express & MongoDB",
            "instructor": {
                "_id": "6880d9ddfff92b5322bc07a9",
                "firstName": "God",
                "lastName": "Alpha",
                "email": "godalpha88@gmail.com",
                "password": "$2b$10$YoSJNhDUyy0x86mCGPlEYO2wpJUPjWVKSdTny5Gps3a6w33z34Mc.",
                "accountType": "Instructor",
                "additionalDetails": {
                    "deletionScheduledAt": null,
                    "_id": "688e5dfeaabfcb1c7db9155d",
                    "dateOfBirth": "2001-11-20",
                    "about": "I am an Educator",
                    "contactNumber": "9876543210",
                    "gender": "Male",
                    "__v": 0
                },
                "courses": [
                    "6880df6f9515e27a9c7de7b9",
                    "6880e388d4029762e9e286cb"
                ],
                "image": "https://api.dicebear.com/5.x/initials/svg?seed=GodAlpha",
                "deletionScheduledAt": null,
                "courseProgress": [],
                "__v": 0,
                "resetPasswordExpires": "2025-07-29T19:22:29.730Z",
                "token": "a23fb74b363c09f285181c4b9621f17f2a5bc294164e289316b340ba66057741"
            },
            "whatYouWillLearn": "HTML, CSS, JavaScript, Node, MongoDB",
            "courseContent": [
                {
                    "_id": "6880ecb1dd16a4b3a5341c89",
                    "sectionName": "Introduction to Web Development",
                    "subSection": [
                        {
                            "_id": "68811047e81e6685c235f4f1",
                            "title": "What is Web Development?",
                            "timeDuration": "6:12",
                            "description": "Understand what web development is, the roles involved, and the difference between frontend and backend.",
                            "videoUrl": "https://res.cloudinary.com/dey3zako7/video/upload/v1753288774/StudyNotion/CourseVideo/ut0ussw2alk5c9jdalzt.mp4",
                            "__v": 0
                        },
                        {
                            "_id": "688118609e9c3182096da60c",
                            "title": "How the Web Works",
                            "timeDuration": "6:52",
                            "description": "A quick overview of HTTP, browsers, and servers, and how they interact.",
                            "videoUrl": "https://res.cloudinary.com/dey3zako7/video/upload/v1753290847/StudyNotion/CourseVideo/qj3bjoqqksc0lfp9ey5y.mp4",
                            "__v": 0
                        }
                    ],
                    "__v": 0
                },
                {
                    "_id": "6880edbedd16a4b3a5341c8e",
                    "sectionName": "HTML & CSS Fundamentals",
                    "subSection": [],
                    "__v": 0
                },
                {
                    "_id": "6880ede0dd16a4b3a5341c93",
                    "sectionName": "JavaScript Essentials",
                    "subSection": [],
                    "__v": 0
                },
                {
                    "_id": "6880edf3dd16a4b3a5341c98",
                    "sectionName": "Frontend Development with React",
                    "subSection": [],
                    "__v": 0
                },
                {
                    "_id": "6880ee08dd16a4b3a5341c9d",
                    "sectionName": "Backend Development with Node.js & Express",
                    "subSection": [],
                    "__v": 0
                }
            ],
            "ratingAndReview": [],
            "price": 999,
            "thumbnail": "https://res.cloudinary.com/dey3zako7/image/upload/v1753276271/StudyNotion/ThumbnailImages/lckjx6mkqyxjzsm9yurg.png",
            "tag": [],
            "categories": "68807920de56cedd423aaefd",
            "studentsEnrolled": [],
            "instruction": [],
            "__v": 0
        }

    ],
  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 999,
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 1,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const course = action.payload
      const index = state.cart.findIndex((item) => item._id === course._id)
      if(index >= 0) {
        toast.error("Course already in cart")
        return
      }
      state.cart.push(course)
      state.totalItems++
      state.total += course.price
      localStorage.setItem("cart", JSON.stringify(state.cart))
      localStorage.setItem("total", JSON.stringify(state.total))
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
      toast.success("Course added to cart")
    },
    removeFromCart: (state, action) => {
      const courseId = action.payload
      const index = state.cart.findIndex((item) => item._id === courseId)

      if(index >= 0) {
        state.totalItems--
        state.total -= state.cart[index].price
        state.cart.splice(index, 1)
        localStorage.setItem("cart", JSON.stringify(state.cart))
        localStorage.setItem("total", JSON.stringify(state.total))
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
        toast.success("Course removed from cart")
      }
    },
    resetCart: (state) => {
      state.cart = []
      state.total = 0
      state.totalItems = 0
      localStorage.removeItem("cart")
      localStorage.removeItem("total")
      localStorage.removeItem("totalItems")
    },
  },
})

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions

export default cartSlice.reducer
