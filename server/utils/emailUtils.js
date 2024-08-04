const nodemailer = require('nodemailer');

// Configure the transport service 
const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other service
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS   
    }
});

// Function to send email
const sendEmail = ({ to, subject, text }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to,                         
        subject,                   
        text                        
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
