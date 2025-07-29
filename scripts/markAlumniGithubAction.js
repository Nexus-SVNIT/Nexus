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
                            subject: 'Welcome to the Alumni Network!',
                            html: `
                            <html>
                            <head>
                                <style>
                                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
                                    .header { text-align: center; padding: 20px 0; }
                                    .logo { max-height: 80px; }
                                    .content { background-color: #f8f9fa; padding: 25px; border-radius: 8px; }
                                    .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
                                    .info-item { margin-bottom: 10px; }
                                    .info-label { font-weight: bold; }
                                    .button-link { display:inline-block; padding:10px 20px; background-color:skyblue; color:black; border-radius:5px; text-decoration:none; font-weight:bold; }
                                </style>
                            </head>
                            <body>
                                <div style="background-color: black; color: white; font-size: 14px; padding: 20px;">
                                    <div style="margin-bottom: 25px; display: flex; justify-content: center;">
                                        <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="width: 350px;" />
                                    </div>
                                    <div>Dear ${batch.fullName || 'Alumnus'},</div>
                                    <p>Congratulations, now you've become the part of our alumni network!</p>
                                    <p>You're now listed on our <b>Alumni Connect</b> page, where you can connect and inspire others in the Nexus community.</p>
                                    <div style="margin: 20px 0; text-align: center;">
                                        <a href="https://nexus-svnit.in/connect" class="button-link">View Alumni Connect Page</a>
                                    </div>
                                    <p>To help us keep your profile up to date, please provide the following details:</p>
                                    <ul>
                                        <li>Company</li>
                                        <li>Designation</li>
                                        <li>Location</li>
                                        <li>Expertises</li>
                                    </ul>
                                    <p>You can reply to this email with your details, or update your profile directly on the alumni portal:</p>
                                    <div style="margin: 20px 0; text-align: center;">
                                        <a href="https://nexus-svnit.in/profile" class="button-link">Go to Profile Page</a>
                                    </div>
                                    <p>Thanks,<br>Team NEXUS</p>
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
