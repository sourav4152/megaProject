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
  CONTACT_US_API: BASE_URL + "/reach/contact",
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

}

//Courses API
export const courseEndpoints = {
  GET_COURSE_AVERAGE_RATING_API: BASE_URL + "course/getAverageRating"
}