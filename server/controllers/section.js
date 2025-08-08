const Section = require("../models/section")
const Course = require("../models/course")
const SubSection = require("../models/subSection")


exports.createSection = async (req, res) => {
    try {

        const { sectionName, courseId } = req.body;
        const userId = req.user.id;

        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All details are required"
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        if (course.instructor.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not the creator of this course",
            });
        }

        const newSection = await Section.create({ sectionName });

        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, { $push: { courseContent: newSection._id } }, { new: true })
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        return res.status(201).json({
            success: true,
            message: "Section created successfully",
            updatedCourse: updatedCourseDetails
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while creating Sections"
        })
    }
}


exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    console.log(course);
    res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });
    const section = await Section.findById(sectionId);
    console.log(sectionId, courseId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    await SubSection.deleteMany({ _id: { $in: section.subSection } });

    await Section.findByIdAndDelete(sectionId);

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};