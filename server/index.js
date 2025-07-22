const express= require("express")
const app= express();

//import routes
const user= require("./routes/user")
const profile= require("./routes/profile")
// const{payment}= require("./routes/payment")
const course= require("./routes/course")


require("dotenv").config();

const database= require("./config/database");
const cookieParser= require("cookie-parser");
const cors= require("cors");
const {cloudinaryConnect}= require("./config/cloudinary");
const fileUpload= require("express-fileupload");

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin:"http://localhost:1573",
        credentials:true
    })
)

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp"
    })
)

database.connect();
cloudinaryConnect();

app.use("/api/v1/auth", user)
app.use("/api/v1/profile", profile)
// app.use("/api/v1/payment", payment)
app.use("/api/v1/course", course)



app.get("/", (req,res)=>{
    return res.json({
        success:true,
        message:"your server is started"
    })
})

app.listen(PORT, ()=>{
    console.log(`server started at ${PORT}`);  
})
