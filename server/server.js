// Load environment variables
require("dotenv").config();

// Basic server setup
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware imports
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// Route imports
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/course");
const paymentRoutes = require("./routes/payment");

// Config imports
const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// ========== Middleware Configurations ==========

// Parse JSON bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Enable CORS
app.use(cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true
}));

// Handle file uploads
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp"
}));

// ========== Database & Cloudinary Setup ==========
database.connect();
cloudinaryConnect();

// ========== Cron Jobs ==========
require("./cron/deleteScheduledUsers"); // Schedules background user deletions

// ========== Routes ==========
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

// ========== Health Check ==========
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running!",
    });
});

// ========== Start Server ==========
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
