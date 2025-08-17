 import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router"

import ReactPlayer from "react-player";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from "media-chrome/react";

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import { BiSkipNextCircle, BiSkipPreviousCircle } from "react-icons/bi"
import { MdOutlineReplayCircleFilled } from "react-icons/md"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, completedLectures } = useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true); // State to control replay

  useEffect(() => {
    if (!courseSectionData.length) return
    if (!courseId || !sectionId || !subSectionId) {
      navigate(`/dashboard/enrolled-courses`)
      return;
    }

    const filteredData = courseSectionData.find(
      (course) => course._id === sectionId
    )
    const filteredVideoData = filteredData?.subSection.find(
      (data) => data._id === subSectionId
    )

    setVideoData(filteredVideoData)


    setVideoEnded(false)
    setIsPlaying(false); 
  }, [courseSectionData, sectionId, subSectionId, navigate, courseId])

  // --- Functions like isFirstVideo, goToNextVideo, isLastVideo, goToPrevVideo remain unchanged ---

  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)
    return currentSectionIndx === 0 && currentSubSectionIndx === 0
  }

  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }

  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    return (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    )
  }

  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  const handleReplay = () => {
    setVideoEnded(false);
    setIsPlaying(true);
  }
  return (
    <div className='md:w-[calc(100vw-330px)] p-3 w-screen'>
      {!videoData ? (
        <h1>Loading...</h1>
      ) : (
        <div className="relative">
          <MediaController
            style={{
              width: "100%",
              aspectRatio: "16/9",
            }}
          >
            <ReactPlayer
              slot="media"
              onReady={()=> setIsPlaying(false)}
              key={videoData.videoUrl}
              src={videoData.videoUrl}
              controls={false}
              playing={isPlaying}
              onEnded={() => {
                setVideoEnded(true);
                setIsPlaying(false)
              }}
              style={{
                width: "100%",
                height: "100%",
                "--controls": "none",
              }}
            ></ReactPlayer>
            <MediaControlBar>
              <MediaPlayButton />
              <MediaSeekBackwardButton seekOffset={10} />
              <MediaSeekForwardButton seekOffset={10} />
              <MediaTimeRange />
              <MediaTimeDisplay showDuration />
              <MediaMuteButton />
              <MediaVolumeRange />
              <MediaPlaybackRateButton />
              <MediaFullscreenButton />
            </MediaControlBar>
          </MediaController>
          {videoEnded && (
            <div className="absolute inset-0 z-10 grid place-content-center bg-black bg-opacity-50">
              <div className="flex flex-col items-center gap-y-4">
                {!completedLectures.includes(subSectionId) && (
                  <button
                    disabled={loading}
                    onClick={handleLectureCompletion}
                    className='bg-yellow-100 text-richblack-900 hover:scale-90 z-20 font-medium md:text-sm px-4 py-2 rounded-md'
                  >
                    {loading ? "Loading..." : "Mark as Completed"}
                  </button>
                )}
                <div className="flex items-center gap-x-8 text-white">
                  {!isFirstVideo() && (
                    <BiSkipPreviousCircle onClick={goToPrevVideo} className="text-2xl md:text-5xl cursor-pointer hover:scale-90" />
                  )}
                  <MdOutlineReplayCircleFilled onClick={handleReplay} className="text-2xl md:text-5xl cursor-pointer hover:scale-90" />
                  {!isLastVideo() && (
                    <BiSkipNextCircle onClick={goToNextVideo} className="text-2xl md:text-5xl cursor-pointer hover:scale-90" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div className='mt-5'>
        <h1 className='text-2xl font-bold text-richblack-25'>{videoData?.title}</h1>
        <p className='text-gray-500 '>{videoData?.description}</p>
      </div>
    </div>
  )
}

export default VideoDetails