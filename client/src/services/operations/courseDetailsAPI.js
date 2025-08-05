import {toast} from 'react-hot-toast'

import {apiConnector} from '../apiconnector'
import { courseEndpoints } from '../apis'


const{GET_COURSE_AVERAGE_RATING_API}= courseEndpoints

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