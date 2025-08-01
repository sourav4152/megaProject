const mongoose = require("mongoose")



const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase:true
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        required: true,
        enum: ["Admin", "Student", "Instructor"]
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile"
    },
    courses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ],
    image:{
        type:String,
        required:true,
    },

    
    //only use when user visit reset password
    token:{
        type:String
    },
    resetPasswordExpires:{
        type:Date
    },
    deletionScheduledAt:{
        type:Date,
        default:null
    },


    courseProgress:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress"
        }
    ],

})


module.exports= mongoose.model("User",userSchema);