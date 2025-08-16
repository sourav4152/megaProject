require("dotenv").config();
const User = require("../models/user")
const Course = require("../models/course");
const CourseProgress = require("../models/courseProgress");
const mongoose = require("mongoose");
const crypto = require("node:crypto")
const { instance } = require("../config/razorpay");
const mailSender = require("../utils/mailSender");

//template
const { courseEnrollmentEmail } = require("../mail/Template/CourseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/Template/PaymentSuccessEmail");


exports.capturePayment = async (req, res) => {

  const { courses } = req.body;
  const userId = req.user.id;

  if (!courses || !Array.isArray(courses) || courses.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please Provide CourseId"
    });
  }

  let totalAmount = 0;

  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.status(200).json({
          success: false,
          message: "course Id is invalid"
        })
      }
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "Student is already Enrolled"
        });
      }

      totalAmount += course.price;

    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });

    }
  }

  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: `receipt_${crypto.randomBytes(16).toString('hex')}`,
  }

  try {
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    res.json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." });
  }

}

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body;
  const userId = req.user.id;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
    return res.status(400).json({ success: false, message: "Payment verification failed: Missing required fields." });
  }

  // Construct the string for signature verification
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  // Create the expected signature using your secret key
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  // Compare the expected signature with the one from Razorpay
  if (expectedSignature === razorpay_signature) {
    try {
      // First, fetch the payment details from Razorpay to check its status
      const paymentDetails = await instance.payments.fetch(razorpay_payment_id);

      // Check if the payment has already been captured
      if (paymentDetails.status === 'captured') {
        // If it's already captured, assume this is a duplicate request and proceed
        // with your business logic (enrollment, etc.)
        await enrollStudents(courses, userId, paymentDetails);
        console.log("Duplicate request received, payment already captured. Proceeding with enrollment.");
        return res.status(200).json({ success: true, message: "Payment already verified. You are enrolled in the course." });
      }

      // If the payment is authorized but not captured, capture it now
      if (paymentDetails.status === 'authorized') {
        const capturedPayment = await instance.payments.capture(razorpay_payment_id, amount);
        await enrollStudents(courses, userId, capturedPayment);
        return res.status(200).json({ success: true, message: "Payment verified and captured successfully." });
      }

      // If the payment is in any other status (failed, created, etc.)
      return res.status(400).json({ success: false, message: "Payment is not in a capturable state." });
    } catch (error) {
      console.error("Error during payment capture or verification:", error);
      return res.status(500).json({ success: false, message: "Server error during payment verification." });
    }
  } else {
    // If the signature is invalid
    return res.status(400).json({ success: false, message: "Invalid signature. Payment failed." });
  }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};


const enrollStudents = async (courses, userId, paymentDetails) => {
  // Validate required fields
  if (!courses || !userId || !paymentDetails) {
    console.error("Enrollment failed: Missing course or user data.");
    return;
  }

  for (const courseId of courses) {
    try {

      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        console.error("Enrollment failed: Course not found.");
        continue; // Skip to the next course if not found
      }

      // Create a CourseProgress entry for the student
      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      // Find and update the user to add the course and progress
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      // Send enrollment email
      await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );

      // Send payment success email
      await mailSender(
        enrolledStudent.email,
        `Payment Received`,
        paymentSuccessEmail(
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
          paymentDetails.amount / 100, // Use the amount from the payment details
          paymentDetails.order_id,
          paymentDetails.id // Use payment ID from the payment details
        )
      );
    } catch (error) {
      console.error("Error during student enrollment or email sending:", error);
    }
  }
};
