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

        const { sectionId, title, timeDuration, description } = req.body;
        const video = req.files.videoFile;

        //validation 
        if (!sectionId || !title || !timeDuration || !description) {
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


        const subSectionDetails = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl: uploadDetails.secure_url
        })

        const sectionUpdateDetails = await Section.findByIdAndUpdate(sectionId, { $push: { subSection: subSectionDetails._id } }, { new: true });


        return res.status(201).json({
            success: true,
            message: "sub Section created successfully",
            data: sectionUpdateDetails
        })


    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "something went wrong while creating Sub Sections",

        })
    }
}