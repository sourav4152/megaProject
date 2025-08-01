const express= require("express");
const route =express.Router();
const { deleteAccount, updateProfile, userAllDetails, updateProfilePicture } = require("../controllers/profile");
const { auth } = require("../middlewares/authMiddleWares");
const { resetPasswordToken, resetPassword } = require("../controllers/resetPassword");



route.delete("/deleteProfile",auth, deleteAccount);
route.put("/updateProfile", auth, updateProfile);
route.put("/updateDisplayPicture",auth ,updateProfilePicture)
route.get("/getUserDetails", auth, userAllDetails);
route.post("/reset-password-token",resetPasswordToken);
route.post("/resetpassword",resetPassword);


module.exports= route;
