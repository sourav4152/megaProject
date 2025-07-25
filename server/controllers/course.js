const Course = require("../models/course");
const User = require("../models/user");
const Category = require("../models/categories");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


function isFileTypeSupported(type, supportedTypes) {

    return supportedTypes.includes(type);
}

//createCourse handler function
exports.createCourse = async (req, res) => {
    try {

        const { courseName, courseDescription, whatYouWillLearn, price, category } = req.body;
        const thumbnail = req.files.thumbnailImage;

        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (isNaN(price) || Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a positive number"
            });
        }

        //find userid from body
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details not found"
            })
        }
        if (instructorDetails.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "User is not an instructor"
            });
        }

        //validation for category

        const categoryDetails = await Category.findById(category);

        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Invalid Category"
            })
        }

        const supportedTypes = ["jpg", "jpeg", "png"];

        const fileType = thumbnail.name.split(".")[1].toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(422).json({
                success: false,
                message: "file formate is not supported"
            })
        }

        //upload thumbnail to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, `${process.env.FOLDER_NAME}/ThumbnailImages`)

        //create an entry in DB
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            categories: categoryDetails._id,
            price,
            thumbnail: thumbnailImage.secure_url
        })

        //update user 
        //add new course to users courses
        await User.findByIdAndUpdate({ _id: instructorDetails._id },
            {
                $push: { courses: newCourse._id }
            }
        )
        // add course id in Category 
        await Category.findByIdAndUpdate({ _id: categoryDetails._id }, { $push: { course: newCourse._id } })

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: newCourse
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating course"
        });
    }
}


//get all courses

exports.showAllCourses = async (req, res) => {
    try {

        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReview: true,
            studentsEnrolled: true
        }).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message: "All courses sent successfully",
            data: allCourses
        })



    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching all course"
        });
    }
}



//getCourseDetails 

exports.getCourseDetails = async (req, res) => {
    try {

        const { courseId } = req.body;

        const courseDetails = await Course.find({ _id: courseId })
            .populate(
                {
                    path: "instructor",
                    populate: {
                        path: "additionalDetails"
                    }
                }
            )
            .populate("category")
            .populate("ratingAndReview")
            .populate(
                {
                    path: "courseContent",
                    populate: {
                        path: "subSection"
                    }
                }
            )
            .exec();


        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while fetching course details"
        })

    }
}

//get enrolled courses of user

exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;

        const userDetail = await User.findById(userId)
            .populate({
                path: "courses",
                select: "courseName courseDescription ratingAndReview price thumbnail tag category status instructor",
                populate: [
                    {
                        path: "instructor",
                        select: "firstName lastName image courses",
                        // populate: {
                        //     path: "courses",
                        //     select: "courseName courseDescription  thumbnail tag category ",

                        //     populate: [
                        //         {
                        //             path: "category",
                        //             select: "name description"
                        //         }
                        //     ]
                        // }
                    },
                    {
                        path: "category",
                        select: "name description"
                    }
                ]
            }).exec();

        if (!userDetail) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Enrolled courses fetched successfully",
            data: userDetail.courses,
        });

    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching enrolled courses",
        });
    }
};