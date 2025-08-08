const mongoose = require("mongoose")
const SubSection = require("../models/subSection")
const Section = require("../models/section");
const { uploadVideoToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

const isFileTypeSupported = (type, supportedType) => {
    return supportedType.includes(type);
}

exports.createSubSection = async (req, res) => {
    try {

        const { sectionId, title, description } = req.body;
        const video = req.files.videoFile;

        //validation 
        if (!sectionId || !title || !video || !description) {
            return res.status(422).json({
                success: false,
                message: "All field required"
            })
        }
        if (!mongoose.Types.ObjectId.isValid(sectionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid section ID"
            });
        }



        const supportedTypes = ["mp4", "mov", "avi", "wmv", "flv", "mkv", "webm", "m4v"];

        const fileType = video.name.split(".")[1].toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(422).json({
                success: false,
                message: "file formate is not supported"
            })
        }

        const uploadDetails = await uploadVideoToCloudinary(video, `${process.env.FOLDER_NAME}/CourseVideo`);


        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        });

        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { $push: { subSection: SubSectionDetails._id } },
            { new: true }
        ).populate("subSection");

        return res.status(200).json({ success: true, data: updatedSection });
    } catch (error) {
        console.error("Error creating new sub-section:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.updatedSection = async (req, res) => {

    try {
        const { sectionId, subSectionId, title, description } = req.body;
        const subSection = await SubSection.findById(subSectionId);

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        if (title !== undefined) {
            subSection.title = title;
        }

        if (description !== undefined) {
            subSection.description = description;
        }
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video;

            const supportedTypes = ["mp4", "mov", "avi", "wmv", "flv", "mkv", "webm", "m4v"];

            const fileType = video.name.split(".")[1].toLowerCase();

            if (!isFileTypeSupported(fileType, supportedTypes)) {
                return res.status(422).json({
                    success: false,
                    message: "file formate is not supported"
                })
            }

            const uploadDetails = await uploadVideoToCloudinary(video, `${process.env.FOLDER_NAME}/CourseVideo`);

            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = `${uploadDetails.duration}`;
        }

        await subSection.save();

        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        );

        // console.log("updated section", updatedSection);

        return res.json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection,
        });

    } catch (error) {
        console.error("Error updating sub-section:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    );
    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });
    }

    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    });
  }
};