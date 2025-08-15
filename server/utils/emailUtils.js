const nodemailer = require('nodemailer');

/**
 * Create email transporter with better error handling for Gmail authentication
 * 
 * For Gmail accounts:
 * 1. You need to use an App Password if 2FA is enabled (recommended)
 *    - Go to your Google Account > Security > App passwords
 *    - Create a new app password for "Mail" and "Other (Custom name)"
 *    - Use this password in your .env file
 * 
 * 2. OR enable "Less secure app access" (not recommended)
 *    - This option is being deprecated by Google
 * 
 * 3. OR set up OAuth2 authentication (most secure but requires more setup)
 */
const createTransporter = () => {
  // For regular SMTP with app password
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD
    },
    // Increase debugging when NODE_ENV is development
    ...(process.env.NODE_ENV === 'development' && { debug: true })
  });
};

// Function to send email with better error handling
const sendEmail = async ({ to, subject, text, html, attachments }) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Team Nexus" <${process.env.EMAIL_ID}>`, 
      to,                         
      subject,                   
      text,
      html,
      attachments
    };

    // Verify SMTP connection configuration
    await new Promise((resolve, reject) => {
      // Only verify in development mode to avoid unnecessary connection attempts
      if (process.env.NODE_ENV === 'development') {
        transporter.verify(function (error, success) {
          if (error) {
            console.log('SMTP connection error:', error);
            reject(error);
          } else {
            console.log('SMTP server is ready to send messages');
            resolve(success);
          }
        });
      } else {
        resolve(true);
      }
    });

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;

  } catch (error) {
    // Provide more helpful error messages based on common issues
    if (error.code === 'EAUTH') {
      console.error('EMAIL AUTHENTICATION ERROR: Check your email/password or create an app-specific password');
      console.error('Visit https://support.google.com/accounts/answer/185833 for more info');
    }
    if (error.code === 'ESOCKET') {
      console.error('EMAIL CONNECTION ERROR: Could not connect to email server');
    }
    
    throw error;
  }
};

module.exports = { sendEmail };