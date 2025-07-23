const jwt = require("jsonwebtoken");
const User = require("../models/user")
require("dotenv").config();


//auth
exports.auth = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token =
        req.cookies.token ||
        req.body.token ||
        (authHeader && authHeader.replace("Bearer ", ""));

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Login again"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token is invalid"
        });
    }
};


//isStudent
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(403).json({
                success: false,
                message: "Access denied, this is protected routes for Students"
            })
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified, please try again"
        })
    }
}



//isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "Access denied, this is protected routes for Instructor"
            })
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified, please try again"
        })
    }
}



//isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied, this is protected routes for Admin"
            })
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified, please try again"
        })
    }
}
