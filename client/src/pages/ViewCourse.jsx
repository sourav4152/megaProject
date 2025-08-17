import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router"

import CourseReviewModal from "../components/core/viewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/viewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"


export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)
  // MODIFIED: Added a local state to manage the loading status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ; (async () => {
      // MODIFIED: Set loading to true before the API call starts
      setLoading(true);
      const courseData = await getFullDetailsOfCourse(courseId, token)

      dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
      dispatch(setEntireCourseData(courseData.courseDetails))
      dispatch(setCompletedLectures(courseData.completedVideos))
      let lectures = 0
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length
      })
      dispatch(setTotalNoOfLectures(lectures))
      // MODIFIED: Set loading to false after the API call is complete and state is updated
      setLoading(false);
    })()

  }, [courseId, dispatch, token])

  return (
    <>
      {/* MODIFIED: Conditionally render based on the loading state */}
      {loading ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          Loading...
        </div>
      ) : (
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
          <VideoDetailsSidebar setReviewModal={setReviewModal} />
          <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
            <div className="mx-6">
              <Outlet />
            </div>
          </div>
        </div>
      )}
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}