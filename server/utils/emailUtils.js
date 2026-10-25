const nodemailer = require('nodemailer');

let cachedTransporter = null;

/**
 * Get or create reusable nodemailer transporter with connection pooling
 */
const getTransporter = () => {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      // Debug in development mode only
      ...(process.env.NODE_ENV === 'development' && { debug: true })
    });
  }
  return cachedTransporter;
};

/**
 * Send an email with robust error handling and optional critical error propagation.
 * 
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plaintext body
 * @param {string} [options.html] - HTML body
 * @param {Array} [options.attachments] - Email attachments
 * @param {boolean} [options.critical=false] - When true, throws on failure. When false, logs and returns null safely.
 */
const sendEmail = async ({ to, subject, text, html, attachments, critical = false }) => {
  if (!process.env.EMAIL_ID || !process.env.EMAIL_PASSWORD) {
    const warning = '[EmailService] Missing EMAIL_ID or EMAIL_PASSWORD environment variables. Email was not sent.';
    console.warn(warning);
    if (critical) {
      throw new Error(warning);
    }
    return null;
  }

  if (!to) {
    const warning = '[EmailService] Recipient email ("to") is undefined or empty. Email was not sent.';
    console.warn(warning);
    if (critical) {
      throw new Error(warning);
    }
    return null;
  }

  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"Team Nexus" <${process.env.EMAIL_ID}>`,
      to,
      subject,
      text,
      html,
      attachments
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error(`[EmailService] Failed to send email to "${to}":`, error.message);

    if (error.code === 'EAUTH') {
      console.error('[EmailService] AUTHENTICATION ERROR: Invalid Gmail credentials or expired App Password.');
      console.error('[EmailService] Check https://support.google.com/accounts/answer/185833');
    } else if (error.code === 'ESOCKET') {
      console.error('[EmailService] CONNECTION ERROR: Could not connect to Gmail SMTP server.');
    }

    if (critical) {
      throw error;
    }
    return null;
  }
};

module.exports = { sendEmail };