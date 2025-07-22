const express= require("express");
const route =express.Router();


const {createCourse} =require("../controllers/course");


const {showAllCategories} =require("../controllers/category")


const {createSection, updateSection, deleteSection} =require("../controllers/section")


const {createSubSection} = require("../controllers/subSection")

const {createRating, getAverageRating, getAllRating} =require("../controllers/ratingAndReview")

const {auth, isInstructor, isStudent}= require("../middlewares/authMiddleWares")


route.post("/createCourse", auth, isInstructor, createCourse);
route.post("/addSection", auth, isInstructor, createSection);
route.post("/updateSection", auth, isInstructor, updateSection);
route.post("/deleteSection", auth, isInstructor, deleteSection);




route.post("/createRating", auth ,isStudent, createRating);
route.post("/getAverageRating", getAverageRating);
route.post("/getReviews" , getAllRating);


module.exports= route;
