const { google } = require('googleapis');
const fs = require('fs');
const AlumniDetails = require('../models/alumniDetailModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const user = require('../models/userModel.js');
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
        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        // Upload the image to Google Drive
        const file = await uploadImageToDrive(req.file.path, req.file.originalname);

        if (!file) {
            return res.status(500).json({ message: "Failed to upload image" });
        }

        const alumniDetail = {
            ...req.body,
            ImageLink: `https://lh3.googleusercontent.com/d/${file.id}` // Store the Google Drive link in the database
        };

        await AlumniDetails.create(alumniDetail);

        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Set up mail options
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: req.body['E-Mail'], // Assuming instituteEmail is provided in the form data
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

        // Send mail
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Waiting for Review" });
    } catch (err) {
        console.error('Error adding alumni details:', err.message);
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

const signupAlumni = async (req, res) => {
    const { 
        fullName, admissionNumber, mobileNumber, personalEmail, 
        branch, linkedInProfile, githubProfile, leetcodeProfile, 
        codeforcesProfile, codechefProfile, password, shareCodingProfile 
    } = req.body;

    try {
        // Check if the user is actually an alumni
        if (!isAlumni(admissionNumber)) {
            return res.status(400).json({ 
                message: 'You are not eligible for alumni registration yet. Please use regular student signup.' 
            });
        }

        // Validate coding profile IDs
        try {
            validateCodingProfiles(leetcodeProfile, codeforcesProfile, codechefProfile);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        // Check if alumni already exists
        const existingUser = await user.findOne({ admissionNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create new alumni user
        const newUser = new user({
            fullName,
            admissionNumber,
            mobileNumber,
            personalEmail,
            branch,
            linkedInProfile,
            githubProfile,
            leetcodeProfile,
            codeforcesProfile,
            codechefProfile,
            shareCodingProfile,
            password,
            verificationToken,
            isAlumni: true // Add this field to distinguish alumni
        });

        await newUser.save();

        // Send verification email to personal email
        const verificationUrl = `${req.headers.referer}auth/alumni/verify/${verificationToken}`;
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: personalEmail,
            subject: 'Verify your Alumni Account',
            html: `
                <div style="background-color: black; color:white; font-size:12px; padding:20px;">
                    <div style="margin-bottom: 25px; display:flex; justify-content: center;">
                        <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="width:350px"/>
                    </div>
                    <div>Dear ${fullName},</div>
                    <p>Thank you for registering on NEXUS portal as an alumni. Please verify your email using following link.</p>
                    <button style="background-color:skyblue; border-radius:15px; padding:10px; border: none; outline: none;">
                        <a href="${verificationUrl}" style="color:black">Verify Your Email</a>
                    </button>
                    <p>Thanks,<br>Team NEXUS</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: 'Alumni registered. Verification email sent!' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
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
    signupAlumni,
    verifyAlumniEmail 
};
