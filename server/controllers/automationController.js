const User = require('../models/userModel');
const nodemailer = require('nodemailer');

function getProgramDuration(prefix) {
    if (prefix === 'U') return 4;
    if (prefix === 'P') return 2;
    if (prefix === 'D' || prefix === 'I') return 5;
    return null;
}

function getAdmissionYear(admissionNumber) {
    const match = admissionNumber.match(/^([UPDI])(\d{2})/i);
    if (!match) return null;
    const year = parseInt(match[2], 10);
    return year >= 0 && year <= 99 ? 2000 + year : null;
}

exports.markAlumniAutomation = async (req, res) => {
    try {
        const users = await User.find({ isAlumni: { $ne: true } });
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        let markedCount = 0;

        for (const user of users) {
            const admissionNumber = user.admissionNumber;
            if (!admissionNumber) continue;

            const prefix = admissionNumber[0].toUpperCase();
            const duration = getProgramDuration(prefix);
            const admissionYear = getAdmissionYear(admissionNumber);

            if (!duration || !admissionYear) continue;

            const alumniYear = admissionYear + duration;
            const isAlumni = (currentYear > alumniYear) ||
                (currentYear === alumniYear && currentMonth >= 5);

            if (isAlumni) {
                user.isAlumni = true;
                user.isVerified = true;
                await user.save();
                markedCount++;
            }
        }

        // Send report email
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
            text: `The alumni marking automation has run.\nUsers marked as alumni: ${markedCount}\nTimestamp: ${new Date().toISOString()}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, markedCount });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
