const express= require("express");
const route =express.Router();

const {auth, isStudent}= require("../middlewares/authMiddleWares")
const {capturePayment, verifySignature} =require("../controllers/payments");
const { model } = require("mongoose");

route.post("/capturePayment" ,auth,isStudent,capturePayment);
route.post("verifySignature", verifySignature);


module.exports= route;