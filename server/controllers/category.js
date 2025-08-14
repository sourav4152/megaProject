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


// the problem with delete Category that what will happen to the courses that is in that category  
// thats why this code is not in use

// exports.deleteCategory = async (req, res) => {
//   try {
//     const categoryId = req.params.id;

//     // Validate category ID format
//     if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid category ID",
//       });
//     }

//     // Check if category exists
//     const category = await Category.findById(categoryId);
//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     // Delete the category
//     await Category.findByIdAndDelete(categoryId);

//     return res.status(200).json({
//       success: true,
//       message: `Category '${category.name}' deleted successfully`,
//     });
//   } catch (error) {
//     console.error("Delete category error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while deleting the category",
//       error: error.message,
//     });
//   }
// };


//get all category only for admin

exports.showAllCategories = async (req, res) => {
    try {

        const allCategories = await Category.find({}, { name: true, description: true ,course:true});
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


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//category Page details 
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: "ratingAndReview",
      })
      .exec();

    if (!selectedCategory) {
      console.log("Category not found.");
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (selectedCategory.course.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(200).json({
        success: true,
        message: "No courses found for the selected category.",
      });
    }

    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "course",
        match: { status: "Published" },
      })
      .exec();
    console.log();

    const allCategories = await Category.find()
      .populate({
        path: "course",
        match: { status: "Published" },
      })
      .exec();
    const allCourses = allCategories.flatMap((category) => category.course);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
