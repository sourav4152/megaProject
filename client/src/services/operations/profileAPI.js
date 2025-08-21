import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { profileEndPoint } from "../apis";
import { logout } from './authAPI'
import { setUser, setLoading } from '../../slices/profileSlice'




const { GET_USER_ENROLLED_COURSES_API,
    GET_USER_DETAILS_API,
    GET_INSTRUCTOR_DATA_API
} = profileEndPoint;

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      })
    //   console.log("GET_USER_DETAILS API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
      dispatch(setUser({ ...response.data.data, image: userImage }))
    } catch (error) {
      dispatch(logout(navigate))
      console.log("GET_USER_DETAILS API ERROR............", error)
      toast.error(error.response?.data?.message || error.message)
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}


export async function getEnrolledCourses(token) {
    // const toastId = toast.loading("Fetching enrolled Courses");
    let result = [];
    try {
        const response = await apiConnector("POST", GET_USER_ENROLLED_COURSES_API, null, {
            Authorization: `Bearer ${token}`
        });

        // console.log("GET_USER_ENROLLED_COURSES_API API RESPONSE............", response);

        if (!response.data.success) {
            console.log("GET_USER_ENROLLED_COURSES_API API Error", response);
            throw new Error(response.data.message);
        }

        result = response.data.data;
    } catch (error) {
        console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error);
        toast.error(error.response?.data?.message || error.message);
    }
    // toast.dismiss(toastId);
    return result;
}


export async function getInstructorData(token) {
    let result = [];
    try {
        const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
            Authorization: `Bearer ${token}`
        });

        // console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response);

        if (!response.data.success) {
            console.log("GET_INSTRUCTOR_DATA_API API Error", response);
            throw new Error(response.data.message);
        }

        result = response?.data?.data;
    } catch (error) {
        console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error);
        toast.error(error.response?.data?.message || error.message);
    }
    return result;
}