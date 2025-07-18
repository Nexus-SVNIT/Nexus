const { google } = require('googleapis');
const fs = require('fs');
const AlumniDetails = require('../models/alumniDetailModel');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const { validateCodingProfiles } = require('../utils/validateCodingProfiles');
const { validateAlumni } = require('../utils/validateAlumni');

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
    }
});

/*
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
*/

// Alumni data retrieval functions with pagination and the specific filters
//(for users)
const getAllAlumniDetails = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Filters
        const { batchFrom, batchTo, company,expertise, q } = req.query;
        const query = { isAlumni: true , isVerified: true };

        // Batch (passingYear) range filter
        if (batchFrom || batchTo) {
            query.passingYear = {};
            if (batchFrom) query.passingYear.$gte = Number(batchFrom);
            if (batchTo) query.passingYear.$lte = Number(batchTo);
        }

        
        if (company) {
            query.currentCompany = { $regex: company, $options: 'i' };
        }

        if(expertise) {
            query.expertise = { $regex: expertise, $options: 'i' };
        }

        // Common search query (name, admission no, company, expertise)
        if (q) {
            query.$or = [
                { fullName: { $regex: q, $options: 'i' } },
                { admissionNumber: { $regex: q, $options: 'i' } },
                { currentCompany: { $regex: q, $options: 'i' } },
                { expertise: { $regex: q, $options: 'i' } }
            ];
        }

        const total = await User.countDocuments(query);
        const alumniDetails = await User.find(query)
            .sort({ createdAt: 1 })
            .select('fullName passingYear currentDesignation currentCompany expertise linkedInProfile location admissionNumber imageLink')
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            data: alumniDetails,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching all alumni:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


const getAllCompanies = async (req, res) => {
    try {
        const companies = await User.distinct('currentCompany', { 
            isAlumni: true, 
            isVerified: true,
            currentCompany: { $nin: [null, ''] }
        });

        return res.status(200).json({ companies });
    } catch (error) {
        console.error("Error fetching companies:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


//retrieving all un verified alumni details (for core team)
const getPendingAlumniDetails = async (req, res) => {
    try {
          const page = parseInt(req.query.page, 10) || 1;
          const limit = parseInt(req.query.limit, 10) || 10;
          const skip = (page - 1) * limit;

        const alumniDetails = await User.find({isAlumni:true , isVerified: false })
            .sort({ createdAt: 1 })
            .select('-isVerified')
            .skip(skip)
            .limit(limit);

        return res.status(200).json(alumniDetails);
    } catch (error) {
        console.error("Error fetching pending alumni:", error);
        return res.status(500).json({ message: "Server error" });
    }
};



const signUpAlumni = async (req, res) => {
    let tempFilePath = req.file?.path;

    try {
        console.log("🔹 Received alumni submission request");

        const requiredFields = [
            'fullName', 'personalEmail', 'admissionNumber',
            'currentDesignation', 'currentCompany','password',
            'mobileNumber', 'passingYear', 'linkedInProfile',
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Admission number format check
        if (typeof req.body['admissionNumber'] !== 'string' || !req.body['admissionNumber'].trim()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid admission number format'
            });
        }

        // Validate alumni admission number
        if (!validateAlumni(req.body['admissionNumber'])) {
            return res.status(400).json({
                success: false,
                message: 'This admission number is not eligible for alumni registration'
            });
        }

        // Coding profiles
        try {
            validateCodingProfiles(req.body['LeetcodeId'], req.body['codeforcesId']);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        // Check for duplicates
        const existingAlumni = await User.findOne({ admissionNumber: new RegExp(`^${req.body['admissionNumber']}$`, 'i') });
        if (existingAlumni) {
            return res.status(409).json({
                success: false,
                message: 'This admission number is already registered'
            });
        }

        //  Generate email verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create alumni user object
        const alumniData = {
            ...req.body,
            isAlumni: true,
            isVerified: false,
            emailVerified: false,
            verificationToken,
            createdAt: new Date()
        };

        const newAlumni = await User.create(alumniData);

        //  Create verification link
        const verificationUrl = `${req.headers.origin || req.headers.referer}alumni/verify/${verificationToken}`;

        // 
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: req.body['personalEmail'],
            subject: 'Verify Your Alumni Email - NEXUS',
            html: `
                <div style="background-color: black; color: white; font-size: 14px; padding: 20px;">
                    <div style="margin-bottom: 25px; display:flex; justify-content: center;">
                        <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="width:350px"/>
                    </div>
                    <p>Dear ${req.body.fullName},</p>
                    <p>Thank you for registering on the NEXUS alumni portal.</p>
                    <p>Please verify your email address by clicking the button below:</p>
                    <a href="${verificationUrl}" style="display:inline-block; padding:10px 20px; background-color:skyblue; color:black; border-radius:5px; text-decoration:none;">Verify Email</a>
                    <p>This verification is required to review and approve your alumni profile.</p>
                    <p>Thanks,<br/>Team NEXUS</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Email verification sent");

        return res.status(201).json({
            success: true,
            message: 'Alumni details submitted. Please verify your email.',
            data: {
                admissionNo: newAlumni.admissionNumber,
                status: 'email_verification_pending',
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Alumni submission error:', error);

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
                    <div>Dear ${userData['fullName']},</div>
                    <p>Thank you for taking the time to connect with us on the NEXUS Alumni portal.</p>
                    <p>Your details are currently under review, and once verified, they will be displayed on our Alumni Connect page.</p>
                    <p>We appreciate your support and look forward to showcasing your achievements to inspire our community.</p>
                    <p>Thanks,<br>Team NEXUS</p>
                </div>
    </body>
    </html>
    `;
}


// Verification functions(for core team)
const toggleVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const alumni = await User.findOne({isAlumni:true,_id:id});

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

// email verification function for alumni called when alumni clicks on verification lnk sent to his mail
const verifyAlumniEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const userData = await User.findOne({isAlumni:true ,verificationToken: token });
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
    signUpAlumni,
    getAllAlumniDetails,
    getPendingAlumniDetails,
    toggleVerification,
    verifyAlumniEmail,
    getAllCompanies
};