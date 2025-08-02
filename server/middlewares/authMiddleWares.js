const jwt = require("jsonwebtoken");
const User = require("../models/user")
require("dotenv").config();


//auth
exports.auth = async (req, res, next) => {
    try {
        let token = null;

        // Method 1: Check for token in the Authorization header (most reliable)
        const authHeader = req.header("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.replace("Bearer ", "");
        }

        // Method 2: Check for token in the request body
        else if (req.body && req.body.token) {
            token = req.body.token;
        }

        // Method 3: Check for token in cookies
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        // If no token is found, send a 401 response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token found, authorization denied"
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        // If the token is invalid, send a 401 response
        return res.status(401).json({
            success: false,
            message: "Token is invalid or expired"
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
