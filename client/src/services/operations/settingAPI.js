import { toast } from 'react-hot-toast'

import { settingsEndpoints } from '../apis'
import { apiConnector } from '../apiconnector'

import { setUser } from '../../slices/profileSlice'

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API
} = settingsEndpoints;


export function updateDisplayPicture(token, formData) {

  // console.log("Token value in Update DisplayPicture:" , token);

  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      )
      // console.log(
      //   "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
      //   response
      // )

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Display Picture Updated Successfully")
      dispatch(setUser(response.data.data))
    } catch (error) {
      // console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
      toast.error(error.response?.data?.message || error.message)
    }
    toast.dismiss(toastId)
  }
}



export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CHANGE_PASSWORD_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Password Changed Successfully")
  } catch (error) {
    console.log("CHANGE_PASSWORD_API API ERROR............", error)
    toast.error(error.response?.data?.message || error.message);
  }
  toast.dismiss(toastId)
}

export function updateProfile(token, formData, navigate) {

  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      })
      // console.log("UPDATE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.updatedUserDetails.image
        ? response.data.updatedUserDetails.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`


      dispatch(
        setUser({ ...response.data.updatedUserDetails, image: userImage })
      )
      toast.success("Profile Updated Successfully")
      navigate("/dashboard/my-profile")

    } catch (error) {
      // console.log("UPDATE_PROFILE_API API ERROR............", error)
      toast.error(error.response?.data?.message || error.message)
    }
    toast.dismiss(toastId)
  }
}