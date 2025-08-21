const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;


export const endPoint = {
  SIGNUP_API: BASE_URL + "auth/signup",
  LOGIN_API: BASE_URL + "auth/login",
  SENDOTP_API: BASE_URL + "auth/sendotp",
  RESET_PASSWORD_TOKEN: BASE_URL + "profile/reset-password-token",
  RESET_PASSWORD_API: BASE_URL + "profile/resetPassword"
}

export const categories = {
  CATEGORIES_API: BASE_URL + "course/showAllCategories"
}

export const contactUsEndpoint = {
  CONTACT_US_API: BASE_URL + "reach/contact",
}

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "profile/deleteProfile",
  RESTORE_ACCOUNT_API: BASE_URL + "profile/restoreAccount"
}

//Profile Page API
export const profileEndPoint = {
  GET_USER_DETAILS_API: BASE_URL + "profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "course/getYourCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "profile/instructorDashboard"

}

//Courses API
export const courseEndpoints = {
  GET_COURSE_AVERAGE_RATING_API: BASE_URL + "course/getAverageRating",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "course/getInstructorCourses",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED: BASE_URL + "course/getFullCourseDetails",
  DELETE_COURSE_API: BASE_URL + "course/deleteCourse",
  CREATE_COURSE_API: BASE_URL + "course/createCourse",
  EDIT_COURSE_API: BASE_URL + "course/updateCourse",
  CREATE_SECTION_API: BASE_URL + "course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "course/updateSubSection",
  DELETE_SECTION_API: BASE_URL + "course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "course/deleteSubSection",
  COURSE_DETAILS_API: BASE_URL + "course/getCourseDetails",
  LECTURE_COMPLETION_API:BASE_URL +"course/updateCourseProgress",
  CREATE_RATING_API:BASE_URL + "course/createRating"
}


//CatalogAPI
export const catalogData = {
  CATALOG_PAGEDATA_API: BASE_URL + "course/categoryPageDetails",
}

//for payment
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "payment/sendPaymentSuccessEmail",
}

//for reviews
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + 'course/getReviews'
}