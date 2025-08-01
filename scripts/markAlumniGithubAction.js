// This script is intended to be run by GitHub Actions to mark users as alumni for a given year.
// Usage: node scripts/markAlumniGithubAction.js [year]

require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../server/models/userModel');

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
    console.error('Error: MONGO_URL environment variable is not set. Please set it before running this script.');
    process.exit(1);
}

function getPassingYear(admissionNo) {
    if (!admissionNo || admissionNo.length < 3) return null;
    const type = admissionNo[0].toUpperCase();
    const yearStr = admissionNo.slice(1, 3);
    const startYear = parseInt('20' + yearStr, 10);
    if (isNaN(startYear)) return null;
    let duration;
    if (type === 'U') duration = 4;
    else if (type === 'P') duration = 2;
    else if (type === 'I' || type === 'D') duration = 5;
    else return null;
    return startYear + duration;
}

async function main() {
    const year = process.argv[2] ? parseInt(process.argv[2], 10) : new Date().getFullYear();
    console.log('Connecting to MongoDB with URL:', MONGO_URL);
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
        console.log('MongoDB connection established.');
    } catch (connErr) {
        console.error('MongoDB connection error:', connErr);
        mongoose.disconnect();
        process.exit(1);
    }
    try {
        const batchSize = 100;
        let updated = 0;
        // For a given year, get admission numbers: P{yy}, U{yy}, I{yy}, D{yy} where yy = (year - duration) % 100
        const yearStr = (y => y.toString().slice(-2))(year);
        const admissionNumbers = [
            `P${(year - 2).toString().slice(-2)}`,
            `U${(year - 4).toString().slice(-2)}`,
            `I${(year - 5).toString().slice(-2)}`,
            `D${(year - 5).toString().slice(-2)}`
        ];
        // Find users whose admissionNumber starts with one of these prefixes and isAlumni is not true
        let cursor = mongoose.connection.db.collection('users').find({
            isAlumni: { $ne: true },
            admissionNumber: { $regex: `^(${admissionNumbers.join('|')})`, $options: 'i' }
        });
        let batch = [];
        const nodemailer = require('nodemailer');
        // Setup mail transporter (use your SMTP credentials)
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or your email provider
            auth: {
                user: process.env.EMAIL_ID, // set in .env
                pass: process.env.EMAIL_PASSWORD  // set in .env
            }
        });
        while (await cursor.hasNext()) {
            batch = await cursor.next();
            if (!batch) break;
            const passingYear = getPassingYear(batch.admissionNumber);
            if (passingYear === year) {
                await mongoose.connection.db.collection('users').updateOne(
                    { _id: batch._id },
                    { $set: { isAlumni: true, isVerified: true, passingYear: String(passingYear) } }
                );
                updated++;
                console.log(`Marked ${batch.fullName || batch._id} as alumni for year ${year}`);
                // Send beautiful HTML email
                if (batch.personalEmail) {
                    try {
                        await transporter.sendMail({
                            from: process.env.EMAIL_ID,
                            to: batch.personalEmail,
                            subject: "Congratulations – You’re Now Part of the Nexus Alumni Network",
                            html: `<html>
                            <head>
                                <meta charset='UTF-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                                <style>
                                    body { background: #111; color: #fff; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; }
                                    .container { max-width: 650px; margin: 40px auto; background: #181818; border-radius: 14px; box-shadow: 0 2px 16px rgba(0,0,0,0.18); overflow: hidden; }
                                    .header { background: #000; color: #fff; padding: 32px 0 18px 0; text-align: center; }
                                    .logo { max-height: 70px; margin-bottom: 10px; }
                                    .title { font-size: 26px; font-weight: 700; margin-bottom: 6px; letter-spacing: 0.5px; }
                                    .subtitle { font-size: 16px; color: #bbb; }
                                    .content { padding: 38px 30px 30px 30px; color: #fff; }
                                    .button-link { display:inline-block; padding:15px 36px; background-color:#0078d4; color:#fff; border-radius:8px; text-decoration:none; font-weight:600; margin: 12px 8px; font-size: 16px; transition: background 0.2s; border:none; }
                                    .button-link:hover { background-color:#005fa3; }
                                    .footer { background: #181818; color: #aaa; text-align: center; font-size: 14px; padding: 22px 12px; border-top: 1px solid #222; }
                                    ul { margin: 18px 0 26px 0; padding-left: 22px; }
                                    .mandatory { color: #ff5252; font-weight: bold; }
                                    .section-title { font-size: 18px; color: #00c6fb; font-weight: 600; margin-top: 30px; margin-bottom: 10px; }
                                </style>
                            </head>
                            <body>
                                <div class='container'>
                                    <div class='header'>
                                        <img class='logo' src='https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC' alt='Nexus Logo' />
                                        <div class='subtitle'>Departmental Cell of DoCSE & DoAI, SVNIT Surat</div>
                                    </div>
                                    <div class='content'>
                                        <p>Dear ${batch.fullName || 'Alumnus'},</p>
                                        <p>Congratulations on achieving this important milestone. As you step into the next chapter of your journey, we are pleased to welcome you to the <b><span style='color: #00c6fb;'>Nexus Alumni Network</span></b> – the official alumni community for the <i>CSE & AI Departments of SVNIT</i>.</p>
                                        <p>Your time at SVNIT has contributed to the legacy of our department, and now, as an alumnus, you become an integral part of the Nexus community that connects students, faculty, and alumni. Through this network, we aim to create opportunities for mentorship, collaboration, and sharing expertise with the batches to come.</p>
                                        <div>To include you in our alumni directory and ensure smooth communication, we request you to share the following details:</div>
                                        <ul>
                                            <li><span class='mandatory'>Branch*</span></li>
                                            <li><span class='mandatory'>LinkedIn Profile*</span> (URL)</li>
                                            <li><span class='mandatory'>Company Name*</span></li>
                                            <li><span class='mandatory'>Designation*</span></li>
                                            <li><span class='mandatory'>Expertise*</span> (Areas you excel in – e.g., AI/ML, Software Development, Cloud, etc.)</li>
                                            <li>GitHub Profile (URL)</li>
                                            <li>LeetCode Profile (ID – e.g., <code>neal_wu</code>)</li>
                                            <li>Codeforces Profile (ID – e.g., <code>tourist</code>)</li>
                                            <li>CodeChef Profile (ID)</li>
                                        </ul>
                                        <div>To get started:</div>
                                        <div style='margin: 28px 0 18px 0; text-align: center;'>
                                            <a href='https://www.nexus-svnit.in/alumni' class='button-link'>Visit Alumni Network Page</a><br>
                                            <a href='https://www.nexus-svnit.in/profile' class='button-link'>Update Your Profile</a><br>
                                            <a href='https://www.nexus-svnit.in/interview-experience' class='button-link'>Share Interview Experience</a>
                                        </div>
                                        <p>This information will help us build a comprehensive alumni network and allow current students to connect with you for guidance and mentorship.</p>
                                        <p>We look forward to your continued involvement and support as part of the Nexus community.</p>
                                        <p>Warm Regards,<br>Team Nexus</p>
                                    </div>
                                    <div class='footer'>
                                        <div><b>Team Nexus</b> &bull; CSE & AI Departments, SVNIT Surat</div>
                                        <div>Contact: <a href='mailto:nexus@coed.svnit.ac.in' style='color:#00c6fb;text-decoration:none;'>nexus@coed.svnit.ac.in</a> | <a href='https://www.nexus-svnit.in' style='color:#00c6fb;text-decoration:none;'>nexus-svnit.in</a></div>
                                        <div>Follow us: <a href='https://www.linkedin.com/company/nexus-svnit' style='color:#00c6fb;text-decoration:none;'>LinkedIn</a> | <a href='https://www.instagram.com/nexus.svnit/' style='color:#00c6fb;text-decoration:none;'>Instagram</a></div>
                                    </div>
                                </div>
                            </body>
                            </html>
                            `
                        });
                        console.log(`Email sent to ${batch.personalEmail}`);
                    } catch (mailErr) {
                        console.error(`Failed to send email to ${batch.personalEmail}:`, mailErr);
                    }
                }
            }
        }
        console.log(`Done. Marked ${updated} users as alumni for year ${year}.`);
    } catch (queryErr) {
        console.error('Error during user query/update:', queryErr);
    }
    mongoose.disconnect();
}

main().catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
});
