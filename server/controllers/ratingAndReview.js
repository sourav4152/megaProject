const RatingAndReview = require("../models/ratingAndReview");
const Course = require("../models/course");
const mongoose = require("mongoose");


// ====================== Create Rating ======================

exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, courseId } = req.body;

    // Ensure student is enrolled
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: userId, //  Cleaner version of $elemMatch + $eq
    });

    if (!courseDetails) {
      return res.status(403).json({
        success: false,
        message: "Student is not enrolled in this course"
      });
    }

    //  Check if user already reviewed
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "You have already reviewed this course"
      });
    }

    // ✅ Create rating & review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      user: userId,
      course: courseId
    });

    // ✅ Push review ref to course
    await Course.findByIdAndUpdate(courseId, {
      $push: { ratingAndReview: ratingReview._id }
    });

    return res.status(201).json({
      success: true,
      message: "Rating & review created successfully"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating review"
    });
  }
};


// ====================== Get Average Rating ======================

exports.getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.body;

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: courseId   // <-- Direct string match
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No ratings available for this course",
        averageRating: 0
      });
    }

    return res.status(200).json({
      success: true,
      message: "Average rating fetched successfully",
      averageRating: result[0].averageRating
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching average rating"
    });
  }
};


// ====================== Get All Ratings ======================

exports.getAllRating = async (req, res) => {
  try {
    const allReview = await RatingAndReview.find({})
      .sort({ rating: -1 })
      .populate({
        path: "user",
        select: "firstName lastName email image"
      })
      .populate({
        path: "course",
        select: "courseName"
      });

    return res.status(200).json({
      success: true,
      message: "All ratings and reviews fetched successfully",
      data: allReview
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching all ratings"
    });
  }
};
