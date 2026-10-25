const nodemailer = require('nodemailer');

/**
 * Create nodemailer transporter optimized for serverless environments (Vercel)
 * - Uses direct SSL on port 465 (reliable on cloud networks)
 * - Automatically strips spaces from App Password if copied with spaces
 * - Explicit timeouts to prevent serverless function hangs
 */
const createTransporter = () => {
  const user = process.env.EMAIL_ID?.trim();
  const pass = process.env.EMAIL_PASSWORD?.replace(/\s+/g, '');

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Direct SSL
    auth: {
      user,
      pass
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000,
    socketTimeout: 10000
  });
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
  const emailId = process.env.EMAIL_ID?.trim();
  const emailPassword = process.env.EMAIL_PASSWORD?.replace(/\s+/g, '');

  if (!emailId || !emailPassword) {
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
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Team Nexus" <${emailId}>`,
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
    } else if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT') {
      console.error('[EmailService] CONNECTION ERROR: Could not connect to Gmail SMTP server.');
    }

    if (critical) {
      throw error;
    }
    return null;
  }
};

module.exports = { sendEmail };