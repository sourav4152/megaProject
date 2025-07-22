const express= require("express");
const route =express.Router();
const { deleteAccount, updateProfile, userAllDetails, updateProfilePicture } = require("../controllers/profile");
const { auth } = require("../middlewares/authMiddleWares");



route.delete("/deleteProfile", deleteAccount);
route.put("/updateProfile", auth, updateProfile);
route.put("/updateDisplayPicture",auth ,updateProfilePicture)
route.get("getUserDetails", auth, userAllDetails);


module.exports= route;
