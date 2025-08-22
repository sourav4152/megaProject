const User = require("../models/user")
const OTP = require("../models/otp")
const Profile = require("../models/profile")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {passwordUpdated} =require("../mail/Template/PasswordUpdate")
const mailSender = require("../utils/mailSender")

require("dotenv").config();

//send otp

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


exports.sendOTP = async (req, res) => {

    try {
        const { email } = req.body;

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            })
        }

        let otp;
        let isUnique = false;
        let attempts = 0;

        // Limit to 5 attempts max (to avoid infinite loop)
        while (!isUnique && attempts < 5) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });

            const existingOTP = await OTP.findOne({ otp });
            if (!existingOTP) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            return res.status(500).json({
                success: false,
                message: "Failed to generate a unique OTP. Try again."
            });
        }


        const otpPayload = { email, otp };

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success: true,
            message: "OTP sent Successfully"
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }


}


//signup 

exports.signUp = async (req, res) => {
    try {

        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        //validation 

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: "All field required"
            })
        }

        if (password !== confirmPassword) {
            return res.status(422).json({
                success: false,
                message: "Password and Confirm Password does not match try again"
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            })
        }

        //find most recent otp
        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
        console.log("recent OTP :", recentOtp);

        if (!recentOtp || recentOtp.otp !== otp || otp.length !== 6) {
            return res.status(422).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        //before creating entry i have tp make profile and save it to DB because it i have to pass the id of profile to user DB
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        })

        //now i will save the data  to user DB
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        })


        return res.status(201).json({
            success: true,
            message: "User is registered Successfully",
            user
        });


    } catch (error) {

        console.log(error);
        res.status(500).json({
            success: false,
            message: "User can not be registered. Please try again"
        })

    }
}


//login
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid input types"
            });
        }

        if (!email || !password){

            return res.status(400).json({
                success: false,
                message: "All field are required"
            })
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }
        let user = await User.findOne({ email }).populate("additionalDetails").exec();
        // console.log(user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User is not registered, please signup first"
            })
        }



        if (await bcrypt.compare(password, user.password)) {

            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }

            let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

            user = user.toObject();
            user.token = token;
            user.password = undefined;


            const options = {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.cookie("token", token, options);

            res.status(200).json({
                success: true,
                user,
                token,
                message: "User logged in successfully"
            })
        }

        else {
            return res.status(401).json({
                success: false,
                message: "Password incorrect"
            })
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failed try again"
        })
    }
}


//change password
exports.changePassword = async (req, res) => {

    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(422).json({
                success: false,
                message: "New password and confirm password do not match"
            });
        }

        //Fetch user from token (must use authentication middleware)
        const userId = req.user.id;
        const user = await User.findById(userId);

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        //Hash and update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        //Send confirmation mail
        await mailSender(
            user.email,
            "Password Changed Successfully",
            passwordUpdated(user.email, user.firstName)
        );

        //Send success response
        return res.status(200).json({
            success: true,
            message: "Password changed and confirmation email sent"
        });

    } catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while changing password"
        });
    }
};