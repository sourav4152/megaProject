const express= require("express");
const { signUp, login, sendOTP, changePassword } = require("../controllers/auth");
const { auth, isStudent, isInstructor, isAdmin } = require("../middlewares/authMiddleWares");
const {resetPasswordToken, resetPassword} =require("../controllers/resetPassword")
const route= express.Router();


route.post("/signup", signUp);

route.post("/login",login)

route.post("/sendotp",sendOTP);

route.post("/changepassword",auth, changePassword);



route.post("/reset-password-token", resetPasswordToken)
route.post("/reset-password", resetPassword);

module.exports= route;