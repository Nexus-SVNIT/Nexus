const { google } = require('googleapis');
const fs = require('fs');

const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { sendEmail }=require('../utils/emailUtils');
const {
  alumniEmailVerificationTemplate,
  alumniEmailVerifiedTemplate,
} = require('../utils/emailTemplates');
const { validateCodingProfiles } = require('../utils/validateCodingProfiles');
const { validateAlumni } = require('../utils/validateAlumni');



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
            .sort({ _id: 1 })
            .select('fullName passingYear currentDesignation currentCompany expertise linkedInProfile location')
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


const getAllCompaniesAndExpertise = async (req, res) => {
    try {
        

        // run both parallel
        const [companies, expertise] = await Promise.all([
            User.distinct('currentCompany', {
                isAlumni: true, 
                isVerified: true,
                currentCompany: { $nin: [null, ''] }
            }),
            User.distinct('expertise', {
                isAlumni: true, 
                isVerified: true,
                expertise: { $nin: [null, ''] }
            })
        ]);

        return res.status(200).json({ companies, expertise });
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
        const verificationUrl = `${req.headers.origin || req.headers.referer}/auth/alumni/verify/${verificationToken}`;

        // 
        const { subject, html } = alumniEmailVerificationTemplate({
            fullName: req.body['fullName'],
            verificationUrl,
        });

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: req.body['personalEmail'],
            subject,
            html
        };

        await sendEmail(mailOptions);
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

        const {html,subject}=alumniEmailVerifiedTemplate({

            fullName: userData.fullName
        } 
        );
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: userData.personalEmail,
            subject,
            html
        };

        await sendEmail(mailOptions);

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
    getAllCompaniesAndExpertise
};