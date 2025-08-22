const { contactUsEmail } = require("../mail/Template/ContactForm");
const mailSender = require("../utils/mailSender");
const ContactUs = require("../models/ContactUs");

exports.contactUsController = async (req, res) => {
  const { email, firstName, lastName  , message, phoneNo, countrycode } =
    req.body;
  // console.log(req.body);
  try {
    await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstName, lastName, message, phoneNo, countrycode)
    );
    //validation
    if (!email || !firstName || !lastName || !message || !phoneNo || !countrycode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //save to database
    const existingContact = await ContactUs.findOne({ email });
    if (existingContact) {
      // add message to existing contact
      existingContact.message.push(message);
      await existingContact.save();
      return res.json({
        success: true,
        message: "Email sent successfully",
      });
    }

    const newContact = await ContactUs.create({
      email,
      firstName,
      lastName,
      message,
      phoneNo,
      countrycode
    });

    return res.json({
      success: true,
      message: "Email send successfully",
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Something went wrong...",
    });
  }
};
