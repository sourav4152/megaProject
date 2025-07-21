const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");



const otpSchema = new mongoose.Schema({
    
   email:{
    type:String,
    required:true
   },
   otp:{
    type:String,
    required:true
   },
   createdAt:{
    type:Date,
    default:Date.now(),
    expires:5*60
   }
})

//for sending otp before entry
async function sendVerificationEmail(email, otp) {
    try {
        const  mailResponse= await mailSender(email,"Verification Email from StudyNotion", otp)
    } catch (error) {
        console.log("error while sending mail: ",error);
        throw error;
    }    
}
otpSchema.pre('save', async function(next) {
    try {
        await sendVerificationEmail(this.email, this.otp);
        next(); 
    } catch (error) {
        console.log("Failed to send OTP email:", error.message);
        next(error); 
    }
});




module.exports= mongoose.model("OTP",otpSchema);