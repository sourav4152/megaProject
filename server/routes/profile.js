const express= require("express");
const route =express.Router();
const { deleteAccount, updateProfile, userAllDetails, updateProfilePicture, restoreAccount, instructorDashboard } = require("../controllers/profile");
const { auth, isInstructor } = require("../middlewares/authMiddleWares");
const { resetPasswordToken, resetPassword } = require("../controllers/resetPassword");



route.delete("/deleteProfile",auth, deleteAccount);
route.put("/updateProfile", auth, updateProfile);
route.put("/updateDisplayPicture",auth ,updateProfilePicture)
route.get("/getUserDetails", auth, userAllDetails);
route.post("/reset-password-token",resetPasswordToken);
route.post("/resetpassword",resetPassword);
route.put("/restoreAccount",auth, restoreAccount);
route.get("/instructorDashboard",auth,isInstructor,instructorDashboard)


module.exports= route;
