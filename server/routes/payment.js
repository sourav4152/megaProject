const express= require("express");
const route =express.Router();

const {auth, isStudent}= require("../middlewares/authMiddleWares")
const {capturePayment, verifyPayment, sendPaymentSuccessEmail} =require("../controllers/payments");
const { model } = require("mongoose");

route.post("/capturePayment" ,auth,isStudent,capturePayment);
route.post("/verifyPayment",auth, verifyPayment);
route.post('/sendPaymentSuccessEmail',auth,sendPaymentSuccessEmail);


module.exports= route;