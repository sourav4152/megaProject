const SubSection = require("../models/subSection")
const Section = require("../models/section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
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


        const supportedTypes = ["mp4", "mov", "avi", "wmv", "flv", "mkv", "webm", "m4v"];

        const fileType = thumbnail.name.split(".")[1].toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(422).json({
                success: false,
                message: "file formate is not supported"
            })
        }

        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        const subSectionDetails = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl: uploadDetails.secure_url
        })

        const sectionUpdateDetails = await Section.findByIdAndUpdate(sectionId, { $push: { subSection: subSectionDetails._id } }, { new: true });


        return res.status(201).json({
            success:true,
            message:"sub Section created successfully",
            data:sectionUpdateDetails
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while creating Sub Sections"
        })
    }
}