const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "Gmail", // or "Outlook", etc.
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send an email using Nodemailer.
 * @param {Object} mailOptions - { to, subject, html }
 * @returns {Promise}
 */
const sendEmail = async ({ to, subject, html }) => {
  const mailData = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailData);
};


module.exports = sendEmail;
