const User = require("../models/user")
const Course = require("../models/course");
const mongoose = require("mongoose");
const crypto = require("node:crypto")
const { instance } = require("../config/razorpay");
const mailSender = require("../utils/mailSender");


exports.capturePayment = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        //validation
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID  is invalid"
            })
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return req.res(422).json({
                success: false,
                message: "Course not found or Course no longer exist"
            })
        }

        const uid = new mongoose.Types.ObjectId(userId);

        if (course.studentsEnrolled.includes(uid)) {
            return req.status(200).json({
                success: false,
                message: "You already enrolled in this Course"
            })
        }

        //create order
        const amount = course.price;
        const currency = "INR"

        const option = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString,
            notes: {
                courseId: courseId,
                userId
            }
        }

        try {

            const paymentResponse = await instance.orders.create(option);
            console.log(paymentResponse);
            return res.status(200).json({
                success: true,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                thumbnail: course.thumbnail,
                orderId: paymentResponse.id,
                currency: paymentResponse.currency,
                message: "Order Initiated successfully"
            })

        } catch (error) {
            return res.status(503).json({
                success: false,
                message: "Service Unavailable, Try again latter"
            })
        }




    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while purchasing the course"
        })
    }
}


exports.verifySignature = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.header("x-razorpay-signature");
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature !== digest) {
      return res.status(401).json({
        success: false,
        message: "Signature verification failed"
      });
    }

    console.log("✅ Payment Authorized");

    const { courseId, userId } = req.body.payload.payment.entity.notes;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found during verification"
      });
    }

    if (!course.studentsEnrolled.includes(userId)) {
      await Course.findByIdAndUpdate(courseId, {
        $push: { studentsEnrolled: userId }
      });

      await User.findByIdAndUpdate(userId, {
        $push: { courses: courseId }
      });

      const user = await User.findById(userId);

      await mailSender(
        user.email,
        "Congratulations! 🎉",
        `You've been successfully enrolled in ${course.courseName}`
      );
    }

    return res.status(201).json({
      success: true,
      message: "Signature verified and course enrollment complete"
    });

  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during signature verification"
    });
  }
};
