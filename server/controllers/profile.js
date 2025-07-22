const User = require("../models/user")
const Profile = require("../models/profile");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();


exports.updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }


    const userDetails = await User.findById(userId).populate("additionalDetails");

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const profile = userDetails.additionalDetails;


    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;


    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile"
    });
  }
};


const isFileTypeSupported = (type, supportedType) => {
  return supportedType.includes(type);
}
exports.updateProfilePicture = async (req, res) => {

  try {

    const displayPicture = req.files?.displayPicture;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No profile picture provided",
      });
    }

    const supportedTypes = ["jpeg", "png", "jpg"];
    const fileType= displayPicture.name.split(".")[1].toLowerCase();

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(422).json({
        success: false,
        message: "file formate is not supported"
      })
    }

    const folderPath = `${process.env.FOLDER_NAME}/ProfilePics`;

    const updatedProfileUrl = await uploadImageToCloudinary(displayPicture, folderPath, 500, 500, 100)

    const updatedData = await User.findByIdAndUpdate(userId, { image: updatedProfileUrl.secure_url }, { new: true })

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      updatedData
    });

  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile picture",
    });
  }
}


//delete Account

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.body.id;

    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found, try again"
      });
    }

    // Schedule deletion 5 days later
    //don't forget to remove user from CourseEnrolled from course
    userDetails.deletionScheduledAt = Date.now() + 5 * 24 * 60 * 60 * 1000;
    await userDetails.save();

    return res.status(200).json({
      success: true,
      message: "Account scheduled for deletion in 5 days"
    });

  } catch (error) {
    console.error("Error scheduling deletion:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while scheduling account deletion"
    });
  }
};


//fetching all user details
exports.userAllDetails = async (req, res) => {
  try {

    const userId = req.body.id;

    const userDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec();

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: userDetails
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong while fetching Users Data"
    })
  }
}
