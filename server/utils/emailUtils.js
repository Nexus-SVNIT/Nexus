const nodemailer = require('nodemailer');

// Configure the transport service 
const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other service
    auth: {
        user: process.env.EMAIL_ID, 
        pass: process.env.EMAIL_PASSWORD   
    }
});

// Function to send email
const sendEmail = ({ to, subject, text, html, attachments }) => {
    const mailOptions = {
        from: process.env.EMAIL_ID, 
        to,                         
        subject,                   
        text,
        html,
        attachments               // Pass attachments if present
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };