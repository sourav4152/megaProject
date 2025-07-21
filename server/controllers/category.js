const Category = require("../models/categories");



//create category only for admin

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        //extra validation 

        const trimmedName = name.trim();
        const trimmedDescription = description.trim();

        if (trimmedName === "" || trimmedDescription === "") {
            return res.status(400).json({
                success: false,
                message: "Category name and description cannot be empty"
            });
        }

        const existingCategory = await Category.findOne({ name: trimmedName });
        if (existingCategory) {
            return res.status(409).json({ success: false, message: "Category already exists" });
        }

        const categoryDetails = await Category.create({
            name: trimmedName,
            description: trimmedDescription
        });

        console.log("Category created:", categoryDetails);

        return res.status(201).json({
            success: true,
            message: `Category '${trimmedName}' created successfully`,
            category: categoryDetails
        });

    } catch (error) {
        console.error("Create category error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the category"
        });
    }
};

//get all category only for admin

exports.showAllCategories = async (req, res) => {
    try {

        const allCategories = await Category.find({}, { name: true, description: true });
        return res.status(200).json({
            success: true,
            message: "All categories returned successfully",
            allCategories
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching Categories"
        });
    }
}


//category Page details 
exports.categoryPageDetails = async (req, res) => {
    try {

        const { categoryId } = req.body;

        const selectedCategory = await Category.findById(categoryId)
            .populate("course")
            .exec();

        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "No course found"
            })
        }

        const differentCategories = await Category.find({ _id: { $ne: categoryId } })
                                    .populate("course")
                                    .exec();
        // find most popular courses
        // top selling courses

        return res.status(200).json({
            success:true,
            message:"Courses sent successfully",
            data:{
                selectedCategory,
                differentCategories,
                //sent most popular and most selling too
            }
        })


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching Categories courses"
        });
    }
}