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
        const userId = req.user.id;

        // Destructure all fields from the request body
        const {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag,
            category,
            status,
            instruction,
        } = req.body;

        // Get thumbnail file from request files
        const thumbnail = req.files.thumbnailImage;

        // 1. Basic validation for all required fields
        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag ||
            !category ||
            !thumbnail
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields are missing.",
            });
        }

        // 2. Validate price as a positive number
        if (isNaN(price) || Number(price) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a positive number.",
            });
        }

        // 3. Check if the user is an instructor
        const instructorDetails = await User.findById(userId);
        if (!instructorDetails || instructorDetails.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "User is not an instructor.",
            });
        }

        // 4. Validate category
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Invalid Category.",
            });
        }

        // 5. Validate and upload thumbnail
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = thumbnail.name.split(".")[1].toLowerCase();
        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(422).json({
                success: false,
                message: "File format is not supported.",
            });
        }

        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            `${process.env.FOLDER_NAME}/ThumbnailImages`
        );

        // 6. Create the new course entry in the database
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag: JSON.parse(tag),
            category: categoryDetails._id,
            instructor: instructorDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status || "Drafted",
            instruction: instruction ? JSON.parse(instruction) : [],
        });

        // 7. Update User model with the new course
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            { $push: { courses: newCourse._id } }
        );

        // 8. Update Category model with the new course
        await Category.findByIdAndUpdate(
            { _id: categoryDetails._id },
            { $push: { course: newCourse._id } }
        );

        return res.status(201).json({
            success: true,
            message: "Course created successfully.",
            data: newCourse,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the course.",
            //   error: error.message,
        });
    }
};

//editCourse handler function
exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const updates = req.body;
        const userId = req.user.id; // Get user ID from the request for authorization

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Security check: Ensure the user is the instructor of the course
        if (course.instructor.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not the owner of this course and cannot edit it.",
            });
        }
        
        // Prepare the updates to be applied
        let updateData = { ...updates };

        // Handle thumbnail image update if a new file is uploaded
        if (req.files) {
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                `${process.env.FOLDER_NAME}/ThumbnailImages`
            );
            updateData.thumbnail = thumbnailImage.secure_url;
        }

        // Handle special cases for JSON strings (e.g., tags, instructions)
        if (updateData.tag) {
          updateData.tag = JSON.parse(updateData.tag);
        }
        if (updateData.instruction) {
          updateData.instruction = JSON.parse(updateData.instruction);
        }
        
        // Use findByIdAndUpdate to perform a partial update without full schema validation
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            updateData,
            { new: true, runValidators: true } // Return the updated document and run validators on the updated fields
        )
        .populate({
            path: "instructor",
            populate: {
                path: "additionalDetails",
            },
        })
        .populate("category")
        .populate("ratingAndReview") 
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec();

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found after update attempt." 
            });
        }

        res.json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



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
                select: "_id courseName courseDescription price thumbnail status studentsEnrolled createdAt updatedAt isDeleted", // Include isDeleted in select
                match: { isDeleted: false }, // Filter out courses where isDeleted is true
                populate: [
                    {
                        path: "courseContent",
                        select: "sectionName subSection",
                        populate: {
                            path: "subSection",
                            select: "title timeDuration", // ADDED: Select timeDuration for sub-sections
                        },
                    },
                ],
            })
            .exec();

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

//get instructor Courses
exports.getInstructorCourses = async (req, res) => {
    try {
        const userId = req.user.id;

        const userDetails = await User.findById(userId)
            .populate({
                path: "courses",
                select: "_id courseName courseDescription price thumbnail status studentsEnrolled createdAt updatedAt isDeleted", // Include isDeleted in select
                match: { isDeleted: false }, // Filter out courses where isDeleted is true
                populate: [
                    {
                        path: "courseContent",
                        select: "sectionName subSection",
                        populate: {
                            path: "subSection",
                            select: "title timeDuration", // ADDED: Select timeDuration for sub-sections
                        },
                    },
                ],
            })
            .exec();

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found",
            });
        }

        // Mongoose populate with `match` returns `null` for non-matching documents,
        // so we need to filter out nulls from the courses array.
        const nonDeletedCourses = userDetails.courses.filter(course => course !== null);


        if (!nonDeletedCourses.length) { // Check the filtered array
            return res.status(200).json({
                success: true,
                message: "Instructor has not created any active courses yet.", // Updated message
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: "Instructor courses fetched successfully",
            data: nonDeletedCourses, // Return the filtered array
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id; // User ID from the authenticated request

        // 1. Validate if the course exists
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        // 2. Validate if the authenticated user is the owner (instructor) of the course
        // Ensure course.instructor is a string or ObjectId for direct comparison
        if (course.instructor.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not the owner of this course and cannot delete it."
            });
        }

        // 3. Perform the soft delete: Mark 'isDeleted' as true
        // Check if the course is already marked as deleted
        if (course.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "This course has already been marked as deleted."
            });
        }

        // MODIFIED: Use findByIdAndUpdate to perform a soft delete without full schema validation
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { isDeleted: true, updatedAt: Date.now() },
            { new: true } // Return the updated document
        );

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found after update attempt." // Should ideally not happen if found initially
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course successfully marked for deletion (soft deleted).",
            course: updatedCourse // Return the updated course document
        });

    } catch (error) {
        console.error("Error deleting course (soft delete):", error); // Use console.error for better visibility
        return res.status(500).json({
            success: false,
            message: "Failed to mark course for deletion. Please try again.",
            error: error.message,
        });
    }
};

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // let courseProgressCount = await CourseProgress.findOne({
    //   courseID: courseId,
    //   userId: userId,
    // });

    // console.log("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // let totalDurationInSeconds = 0;
    // courseDetails.courseContent.forEach((content) => {
    //   content.subSection.forEach((subSection) => {
    //     const timeDurationInSeconds = parseInt(subSection.timeDuration);
    //     totalDurationInSeconds += timeDurationInSeconds;
    //   });
    // });

    // const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        // totalDuration,
        // completedVideos: courseProgressCount?.completedVideos
        //   ? courseProgressCount?.completedVideos
        //   : [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};