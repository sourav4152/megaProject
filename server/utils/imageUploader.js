const cloudinary = require("cloudinary").v2


exports.uploadImageToCloudinary = async (file, folder, height, width, quality) => {
    try {
        const options = {
            folder: folder,
            resource_type: "auto"
        };

        if (height) options.height = height;
        if (width) options.width = width;
        if (quality) options.quality = quality;
        if (height || width) options.crop = "scale";

        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        return result;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

//for video

exports.uploadVideoToCloudinary = async (file, folder) => {
  try {
    const options = {
      folder: folder,
      resource_type: "video",
    };

    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result;

  } catch (error) {
    console.error("Cloudinary video upload error:", error);
    throw error;
  }
};