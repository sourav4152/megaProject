
import ChangeProfilePicture from "./ChangeProfilePicture"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"
import DeleteAccount from "./DeleteAccount"



export default function Settings() {
  return (
    <div className='bg-richblack-900 text-white mx-0 md:mx-5 flex flex-col gap-y-5 md:gap-y-7'>
      <h1 className='font-medium text-richblack-5 text-3xl mb-5 uppercase tracking-wider lg:text-left text-center' >Edit Profile</h1>

      {/* Change Profile Picture */}
      <ChangeProfilePicture />

      {/* Edit Profile Information */}
      <EditProfile />

      {/* Update Password */}
      <UpdatePassword />

      {/* Delete Account */}
      <DeleteAccount />


    </div>
  )
}