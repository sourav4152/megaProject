const express= require("express");
const { signUp, login, sendOTP, changePassword } = require("../controllers/auth");
const { auth, isStudent, isInstructor, isAdmin } = require("../middlewares/authMiddleWares");
const route= express.Router();


route.post("/signup", signUp);

route.post("/login",login)

route.post("/sendotp",sendOTP);

route.post("/changepassword",auth, changePassword);



// authentication of route
route.get("/student", auth, isStudent ,(req,res)=>{
    return res.status(200).json({
        success :true,
        message:"welcome to student page"
    })
})

route.get("/instructor", auth, isInstructor, (req,res)=>{
    return res.status(200).json({
        success :true,
        message:"welcome to instructor page"
    })
})
route.get("/admin", auth, isAdmin,(req,res)=>{
    return res.status(200).json({
        success :true,
        message:"welcome to instructor page"
    })
})