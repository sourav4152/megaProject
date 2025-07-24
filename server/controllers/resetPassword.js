const User = require("../models/user")
const crypto = require("node:crypto");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt")

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


exports.resetPasswordToken = async (req, res) => {

  try {
    const { email } = req.body;

    if (!isValidEmail(email)) {
      return res.status(422).json({
        success: false,
        message: "Email is Invalid"
      })
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "no existing user with this email"
      })
    }

    //creating  password token URL to UPdate password
    const token = crypto.randomBytes(32).toString('hex');

    //update existing user
    const updatedDetails = await User.findOneAndUpdate({ email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 10 * 60 * 1000
      },
      { new: true }
    )

    const url = `http://localhost:5173/update-password/${token}`

    //send mail

    await mailSender(email,
      "Reset your password",
      `<p>Click the link below to reset your password:</p>
       <a href="${url}">${url}</a>
       <p>This link will expire in 15 minutes.</p>`)

    return res.status(200).json({
      success: true,
      message: "Reset password link sent to your email"
    })
  } catch (error) {
    console.log("While sending Reset password email", error);
    return res.status(500).json({
      success: false,
      message: "error while sending reset password link"
    })
  }
}


//reset password function

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    // 1. Validate inputs
    if (!password || !confirmPassword || !token) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    // 2. Get user by token
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    // 3. Check token expiry
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(410).json({
        success: false,
        message: "Token has expired. Please request a new password reset."
      });
    }

    // 4. Hash password and update user in one step
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findOneAndUpdate(
      { token },
      {
        password: hashedPassword,
        token: undefined,
        resetPasswordExpires: undefined
      },
      { new: true }
    );

    console.log("Updated user:", updatedUser);

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully"
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting password"
    });
  }
};