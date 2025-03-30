const { google } = require('googleapis');
const fs = require('fs');
const AlumniDetails = require('../models/alumniDetailModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const { validateCodingProfiles } = require('../utils/validateCodingProfiles');
const { isAlumni } = require('../utils/validateAlumni');

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Google Drive configuration
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
const folderId = process.env.GOOGLE_DRIVE_ALUMNI_FOLDER_ID;

// Improved file upload function with better error handling
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

        // Fix: Use response.data.id instead of fileData.id
        const fileId = response.data.id;

       

        return fileId; // Return the file ID
    } catch (error) {
        console.error("Google Drive upload error:", error);
        throw error; // Re-throw to handle in calling function
    }
};


// Alumni data retrieval functions
const allAlumniDetails = async (req, res) => {
    try {
        const alumniDetails = await AlumniDetails.find({})
            .sort({ createdAt: 1 })
            .select('-isVerified');
        return res.status(200).json(alumniDetails);
    } catch (error) {
        console.error("Error fetching all alumni:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const allVerifiedAlumniDetails = async (req, res) => {
    try {
        const alumniDetails = await AlumniDetails.find({ isVerified: true })
            .sort({ createdAt: 1 })
            .select('-isVerified');
        return res.status(200).json(alumniDetails);
    } catch (error) {
        console.error("Error fetching verified alumni:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const allPendingAlumniDetails = async (req, res) => {
    try {
        const alumniDetails = await AlumniDetails.find({ isVerified: false })
            .sort({ createdAt: 1 })
            .select('-isVerified');
        return res.status(200).json(alumniDetails);
    } catch (error) {
        console.error("Error fetching pending alumni:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Main alumni addition function with comprehensive error handling
const addAlumniDetails = async (req, res) => {
    let tempFilePath = req.file?.path;

    try {
        console.log("🔹 Received alumni submission request");

        // 1. Validate required fields
        const requiredFields = [
            'Name', 'E-Mail', 'Admission No',
            'Current Role', 'Company Name',
            'Mobile Number', 'Passing Year'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            console.warn(`Missing fields: ${missingFields.join(', ')}`);
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // 2. Validate admission number format
        if (typeof req.body['Admission No'] !== 'string' || !req.body['Admission No'].trim()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid admission number format'
            });
        }

        // 3. Validate alumni status
        console.log("🔍 Validating admission number");
        if (!isAlumni(req.body['Admission No'])) {
            return res.status(400).json({
                success: false,
                message: 'This admission number is not eligible for alumni registration'
            });
        }

        // 4. Validate coding profiles
        console.log("🔍 Validating coding profiles");
        try {
            validateCodingProfiles(req.body['LeetcodeId'], req.body['codeforcesId']);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        // 5. Check for existing records
        console.log("🔍 Checking for duplicates");
        const existingAlumni = await AlumniDetails.findOne({
            "Admission No": req.body['Admission No']
        });

        if (existingAlumni) {
            return res.status(409).json({ // 409 Conflict for duplicate resources
                success: false,
                message: 'This admission number is already registered'
            });
        }

        // 6. Process file upload
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Profile image is required'
            });
        }

        console.log("📤 Uploading profile image");
        let fileData;
        try {
            fileData = await uploadImageToDrive(req.file.path, req.file.originalname);
        } catch (uploadError) {
            console.error("Upload failed:", uploadError);
            throw new Error('Failed to upload profile image');
        } finally {
            // Always clean up temp file
            if (tempFilePath && fs.existsSync(tempFilePath)) {
                try {
                    fs.unlinkSync(tempFilePath);
                    console.log("✅ Temporary file cleaned up");
                } catch (cleanupError) {
                    console.error("Cleanup failed:", cleanupError);
                }
            }
        }

        if (!fileData) {
            throw new Error('Failed to process profile image');
        }

        // 7. Create alumni record
        const alumniData = {
            ...req.body,
            ImageLink: `https://lh3.googleusercontent.com/d/${fileData.id}`,
            isVerified: false,
            createdAt: new Date()
        };

        console.log("💾 Saving alumni record...");
        const newAlumni = await AlumniDetails.create(alumniData);
        console.log("✅ Record saved");

        // 8. Send confirmation email
        console.log("📧 Sending verification email...");
        const mailOptions = {
            from: `NEXUS Alumni <${process.env.EMAIL_ID}>`,
            to: req.body['E-Mail'],
            subject: 'Your Alumni Submission is Under Review',
            html: generateVerificationEmailTemplate(req.body)
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Confirmation email sent");

        return res.status(201).json({
            success: true,
            message: 'Your alumni details have been submitted for review',
            data: {
                admissionNo: newAlumni['Admission No'],
                status: 'pending_review',
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Alumni submission error:', error);

        // Final attempt to clean up if not already done
        if (req.file?.path && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (finalError) {
                console.error("Final cleanup failed:", finalError);
            }
        }

        return res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Email template generator function
function generateVerificationEmailTemplate(userData) {
    return `
    <!DOCTYPE html>
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
        </style>
    </head>
    <body>
         <div style="background-color: black; color: white; font-size: 14px; padding: 20px;">
                    <div style="margin-bottom: 25px; display: flex; justify-content: center;">
                        <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="width: 350px;" />
                    </div>
                    <div>Dear ${userData['Name']},</div>
                    <p>Thank you for taking the time to connect with us on the NEXUS Alumni portal.</p>
                    <p>Your details are currently under review, and once verified, they will be displayed on our Alumni Connect page.</p>
                    <p>We appreciate your support and look forward to showcasing your achievements to inspire our community.</p>
                    <p>Thanks,<br>Team NEXUS</p>
                </div>
    </body>
    </html>
    `;
}


// Verification functions
const toggleVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const alumni = await AlumniDetails.findById(id);

        if (!alumni) {
            return res.status(404).json({
                success: false,
                message: "Alumni not found"
            });
        }

        alumni.isVerified = !alumni.isVerified;
        await alumni.save();

        return res.status(200).json({
            success: true,
            message: `Alumni has been ${alumni.isVerified ? "verified" : "unverified"}`,
            data: {
                alumniId: alumni._id,
                isVerified: alumni.isVerified
            }
        });
    } catch (error) {
        console.error("Error toggling verification:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
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