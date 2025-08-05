import { toast } from 'react-hot-toast'

import { apiConnector } from '../apiconnector'
import { courseEndpoints } from '../apis'


const { GET_COURSE_AVERAGE_RATING_API,
        GET_ALL_INSTRUCTOR_COURSES_API,
        DELETE_COURSE_API
        } = courseEndpoints

export const getAverageRatingsForCourses = async (courseIds) => {
    try {
        if (!courseIds || courseIds.length === 0) {
            return {}; // Return empty map if no course IDs are provided
        }

        const promises = courseIds.map(async (courseId) => {
            try {
                const response = await apiConnector("POST", GET_COURSE_AVERAGE_RATING_API, { courseId });
                return {
                    courseId,
                    averageRating: response?.data?.averageRating || 0, // Default to 0 if no ratings
                };
            } catch (error) {
                console.error(`Error fetching rating for courseId ${courseId}:`, error);
                // Return a default value for this specific course to allow others to succeed
                return { courseId, averageRating: 0 };
            }
        });

        const results = await Promise.all(promises);

        const averageRatingsMap = results.reduce((acc, curr) => {
            acc[curr.courseId] = curr.averageRating;
            return acc;
        }, {});

        return averageRatingsMap;

    } catch (error) {
        console.error("Error fetching average ratings for courses:", error);
        toast.error("Could not fetch some ratings. Please try again.");
        return {};
    }
};

export const fetchInstructorCourses = async (token) => {
  let result = []
  // const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    // console.log("INSTRUCTOR COURSES API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR............", error)
    toast.error(error?.response?.data?.message || error.message)
  }
  // toast.dismiss(toastId)
  return result
}

export const deleteCourse= async(courseId, token)=>{
    // const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "PUT",
      DELETE_COURSE_API,
      courseId,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    // console.log("INSTRUCTOR COURSES API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Unable to Delete")
    }
    toast.success(response?.data?.message)
    
  } catch (error) {
    console.log("DELETE COURSES API ERROR............", error)
    toast.error(error?.response?.data?.message || error.message)
  }
  // toast.dismiss(toastId)

}