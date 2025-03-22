const { google } = require('googleapis');
const fs = require('fs');
const AlumniDetails = require('../models/alumniDetailModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const { validateCodingProfiles } = require('../utils/validateCodingProfiles.js');
const { isAlumni } = require('../utils/validateAlumni.js');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
    }
});

const auth = new google.auth.GoogleAuth({
    credentials: {
        type: process.env.GOOGLE_CLOUD_TYPE,
        project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
        private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
        auth_uri: process.env.GOOGLE_CLOUD_AUTH_URI,
        token_uri: process.env.GOOGLE_CLOUD_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL,
        universe_domain: process.env.GOOGLE_CLOUD_UNIVERSE_DOMAIN
    },
    scopes: ['https://www.googleapis.com/auth/drive.file']
});

const drive = google.drive({ version: 'v3', auth });
const folderId = process.env.GOOGLE_DRIVE_ALUMNI_FOLDER_ID; // Replace with your actual folder ID

const uploadImageToDrive = async (imagePath, imageName) => {
    try {
        const fileMetadata = {
            name: imageName,
            parents: [folderId]
        };

        const media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(imagePath)
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        });
        fs.unlinkSync(imagePath); // Delete the image from the server after uploading
        return response.data;
    } catch (error) {
        console.error("Error uploading file to Google Drive:", error);
        return null;
    }
};

const allAlumniDetails = async (req, res) => {
    const alumniDetails = await AlumniDetails.find({}).sort({ createdAt: 1 }).select('-isVerified');
    return res.status(200).json(alumniDetails);
};

const allVerifiedAlumniDetails = async (req, res) => {
    const alumniDetails = await AlumniDetails.find({ isVerified: true }).sort({ createdAt: 1 }).select('-isVerified');
    return res.status(200).json(alumniDetails);
};

const allPendingAlumniDetails = async (req, res) => {
    const alumniDetails = await AlumniDetails.find({ isVerified: false }).sort({ createdAt: 1 }).select('-isVerified');
    return res.status(200).json(alumniDetails);
};

const addAlumniDetails = async (req, res) => {
    try {
        console.log("🔹 Received request to add alumni details.");
        console.log("🔹 Request Body:", req.body);

        let file = null;

        // Step 1: Handle File Upload
        if (req.file) {
            console.log("📤 Uploading image to Google Drive...");
            file = await uploadImageToDrive(req.file.path, req.file.originalname);
            if (!file) {
                console.error("❌ Failed to upload image.");
                return res.status(500).json({ message: "Failed to upload image" });
            }
            console.log("✅ Image uploaded successfully. File ID:", file.id);
        }

        // Step 2: Check if Admission Number is valid for Alumni
        console.log("🔍 Checking if admission number is eligible for alumni registration...");
        if (!isAlumni(req.body['Admission No'])) {
            console.warn("⚠️ Admission number is not eligible for alumni registration.");
            return res.status(400).json({
                message: 'You are not eligible for alumni registration yet. Please use regular student signup.'
            });
        }
        console.log("✅ Admission number is valid for alumni registration.");

        // Step 3: Validate Coding Profiles (Leetcode, Codeforces, CodeChef)
        try {
            console.log("🔎 Validating coding profiles...");
            if (req.body['LeetcodeId'] || req.body['LeetcodeId'].includes) {
                validateCodingProfiles(req.body['LeetcodeId'], req.body['codeforcesId'], req.body['codechefId']);
            }
            console.log("✅ Coding profiles validated successfully.");
        } catch (error) {
            console.error("❌ Error validating coding profiles:", error.message);
            return res.status(400).json({ message: error.message });
        }

        // Step 4: Check if Alumni Already Exists
        console.log("🔍 Checking if alumni already exists with admission number:", req.body['Admission No']);
        const existingAlumni = await AlumniDetails.findOne({ "Admission No": req.body['Admission No'] });
        if (existingAlumni) {
            console.warn("⚠️ Alumni already exists.");
            return res.status(400).json({ message: 'User already exists' });
        }
        console.log("✅ No existing alumni found. Proceeding with new entry.");

        // Step 5: Prepare Alumni Data for Saving
        const alumniDetail = {
            ...req.body,
            ImageLink: file ? `https://lh3.googleusercontent.com/d/${file.id}` : undefined,
            isVerified: false
        };
        console.log("📝 Preparing to save alumni details:", alumniDetail);

        // Step 6: Save Alumni Details to Database
        try {
            console.log("💾 Saving alumni details to database...");
            await AlumniDetails.create(alumniDetail);
            console.log("✅ Alumni details saved successfully.");
        } catch (err) {
            console.error("❌ Error saving alumni details:", err);
            return res.status(500).json({ message: "Error saving alumni details", error: err.message });
        }

        // Step 7: Prepare and Send Verification Email
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: req.body['E-Mail'],
            subject: 'Alumni Details Submission Under Review',
            html: `
                <div style="background-color: black; color: white; font-size: 14px; padding: 20px;">
                    <div style="margin-bottom: 25px; display: flex; justify-content: center;">
                        <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="width: 350px;" />
                    </div>
                    <div>Dear ${req.body['Name']},</div>
                    <p>Thank you for taking the time to connect with us on the NEXUS Alumni portal.</p>
                    <p>Your details are currently under review, and once verified, they will be displayed on our Alumni Connect page.</p>
                    <p>We appreciate your support and look forward to showcasing your achievements to inspire our community.</p>
                    <p>Thanks,<br>Team NEXUS</p>
                </div>
            `
        };

        console.log("📧 Sending verification email...");
        await transporter.sendMail(mailOptions);
        console.log("✅ Verification email sent successfully.");

        return res.status(200).json({ message: "Waiting for Review" });

    } catch (err) {
        console.error('❌ Error adding alumni details:', err);
        return res.status(500).json({ message: "Error adding alumni details", error: err.message });
    }
};


const toggleVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const alumni = await AlumniDetails.findById(id);

        if (!alumni) {
            return res.status(404).json({ message: "Alumni not found" });
        }

        alumni.isVerified = !alumni.isVerified; // Toggle verification status
        await alumni.save();

        return res.status(200).json({
            message: `Alumni has been ${alumni.isVerified ? "verified" : "unverified"}`,
            isVerified: alumni.isVerified
        });
    } catch (error) {
        console.error("Error toggling verification status:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const verifyAlumniEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const userData = await user.findOne({ verificationToken: token });
        if (!userData) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        userData.emailVerified = true;
        userData.verificationToken = undefined; // Remove the token after verification
        await userData.save();

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: userData.personalEmail,
            subject: 'Email Verified - Alumni Account Under Review',
            html: `
                <div style="background-color: black; color: white; font-size: 14px; padding: 20px; font-family: Arial, sans-serif;">
                    <div style="margin-bottom: 25px; display:flex; justify-content: center;">
                        <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="width:350px"/>
                    </div>
                    <div>Dear ${userData.fullName},</div>
                    <p>Thank you for verifying your email address. As an alumni member, your account requires additional verification from our team.</p>
                    <p>Your account is currently under review. Once approved, you will be able to log in to the NEXUS portal.</p>
                    <p>We will notify you via email once the verification is complete.</p>
                    <p>Thanks,<br>Team NEXUS</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    allAlumniDetails,
    addAlumniDetails,
    allVerifiedAlumniDetails,
    allPendingAlumniDetails,
    toggleVerification,
    verifyAlumniEmail
};