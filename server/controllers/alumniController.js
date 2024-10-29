const { google } = require('googleapis');
const fs = require('fs');
const AlumniDetails = require('../models/alumniDetailModel');
const { log } = require('console');

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
            fields: 'id, webViewLink, webContentLink'
        });

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
            ImageLink: file.webViewLink // Store the Google Drive link in the database
        };

        await AlumniDetails.create(alumniDetail);
        return res.status(200).json({ message: "Waiting for Review" });
    } catch (err) {
        console.error('Error adding alumni details:', err.message);
        return res.status(500).json(err);
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

module.exports = { allAlumniDetails, addAlumniDetails, allVerifiedAlumniDetails, allPendingAlumniDetails, toggleVerification };
