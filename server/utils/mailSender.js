const nodemailer = require("nodemailer")
require("dotenv").config();

const mailSender = async (to, subject, htmlContent) => {
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const mailOptions = {
            from: `"StudyNotion Pvt. Ltd." <${process.env.MAIL_USER}>`,
            to,
            subject,
            html: htmlContent,
        }

        await transport.sendMail(mailOptions);

    } catch (error) {
        console.log(error.message);

    }
}

module.exports = mailSender;