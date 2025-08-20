const { default: mongoose } = require("mongoose");

mongoose.set("strictQuery", false);

const contactUsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  message: [{
    type: String,
    required: true
  }],
  phoneNo: {
    type: String,
    required: true
  },
  countrycode: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("ContactUs", contactUsSchema);