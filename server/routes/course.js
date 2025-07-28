const express= require("express");
const route =express.Router();

const {createCategory, categoryPageDetails} =require("../controllers/category");

const {createCourse, getCourseDetails, getEnrolledCourses} =require("../controllers/course");


const {showAllCategories} =require("../controllers/category");


const {createSection, updateSection, deleteSection} =require("../controllers/section")


const {createSubSection} = require("../controllers/subSection")

const {createRating, getAverageRating, getAllRating} =require("../controllers/ratingAndReview")

const {auth, isInstructor, isStudent, isAdmin}= require("../middlewares/authMiddleWares")



route.post("/createCategory", auth, isAdmin, createCategory);
route.post("/categoryPageDetails",categoryPageDetails);

route.post("/getCourseDetails",getCourseDetails);
route.delete("/deleteCategory/:id",auth,isAdmin, );
route.get("/showAllCategories",showAllCategories);

route.post("/createCourse", auth, isInstructor, createCourse);
route.post("/getYourCourses", auth, getEnrolledCourses);


route.post("/addSection", auth, isInstructor, createSection);
route.post("/updateSection", auth, isInstructor, updateSection);
route.post("/deleteSection", auth, isInstructor, deleteSection);

route.post("/addSubSection", auth,isInstructor, createSubSection);


route.post("/createRating", auth ,isStudent, createRating);
route.post("/getAverageRating", getAverageRating);
route.post("/getReviews" , getAllRating);


module.exports= route;
