const express = require("express");
const route = express.Router();
const { contactUsController } = require("../controllers/ContactUs");

route.post("/contact", contactUsController);

module.exports = route;