const nodemailer = require('nodemailer');
const fs = require('fs');

let markedCount = 0;
try {
    markedCount = fs.readFileSync('alumni_marked_count.txt', 'utf8');
} catch (e) {
    markedCount = 'unknown';
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
    }
});

const mailOptions = {
    from: process.env.EMAIL_ID,
    to: process.env.EMAIL_ID,
    subject: 'Alumni Marking Automation Report',
    text: `The alumni marking automation has run on June 1st.\nUsers marked as alumni: ${markedCount}\nPlease check the logs in GitHub Actions for details.`
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending alumni report:', error);
        process.exit(1);
    } else {
        console.log('Alumni report sent:', info.response);
    }
});
