const mongoose = require("mongoose")



const profileSchema = new mongoose.Schema({
    
    gender:{
        type:String,
        enum:["Male", "Female","Transgender"]
    },
    dateOfBirth:{
        type:String,
    },
    about:{
        type:String,
        trim:true,
        maxlength:500
    },
    contactNumber:{
        type: String,
        trim: true,
        minlength: 10,
        maxLength: 15,
        match: [/^\d+$/, "Contact number must be digits only"]
    }

})


module.exports= mongoose.model("Profile",profileSchema);