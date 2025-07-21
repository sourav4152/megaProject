const Section = require("../models/section")
const Course = require("../models/course")


exports.createSection = async (req, res) => {
    try {

        const { sectionName, courseId } = req.body;

        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All details are required"
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
            message: "Section created successfully"
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

        const { sectionName, sectionId } = req.body;

        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All details are required"
            });
        }

        const section = await Section.findByIdAndUpdate(sectionId, { $push: { sectionName } }, { new: true });

        return res.status(200).json({
            success:true,
            message:"Section name updated successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while updating Sections"
        })
    }
}


exports.deleteSection= async(req, res)=>{

    try {
        
        const {sectionId}= req.params;

        await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({
            success:true,
            message:"Section deleted successfully"
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while deleting Sections"
        })
    }
}