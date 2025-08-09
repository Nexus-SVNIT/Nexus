const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const user = require('../models/userModel.js');
const bcrypt = require('bcrypt')
const { sendEmail } = require('../utils/emailUtils.js'); // Adjust the path to your nodemailer utility
const { validateCodingProfiles } = require('../utils/validateCodingProfiles.js'); // Adjust the path to your validation utility
const { alumniVerificationTemplate, alumniRejectionTemplate } = require('../utils/emailTemplates.js');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
    }
});



const loginUser = async (req, res) => {
    const { admissionNumber, password } = req.body;

    try {
        const foundUser = await user.findOne({ admissionNumber });
        if (!foundUser) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if email is verified
        if (!foundUser.emailVerified) {
            return res.status(400).json({ message: 'Please verify your email before logging in.' });
        }

        // Check admin verification for alumni
        if (foundUser.isAlumni && !foundUser.isVerified) {
            return res.status(400).json({
                message: 'Your alumni account is pending verification. Please wait for admin approval.'
            });
        }

        // Password check
        const isMatch = await foundUser.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Final payload
        const payload = {
            id: foundUser._id,
            admissionNumber: foundUser.admissionNumber,
            isAlumni: foundUser.isAlumni || false,
        };

        const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: '7d'
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: foundUser._id,
                fullName: foundUser.fullName,
                isAlumni: foundUser.isAlumni,
                admissionNumber: foundUser.admissionNumber
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};



const signupUser = async (req, res) => {
    const { fullName, admissionNumber, mobileNumber, personalEmail, instituteEmail, branch, linkedInProfile, githubProfile, leetcodeProfile, codeforcesProfile, codechefProfile, password, shareCodingProfile } = req.body;

    try {
        // Validate coding profile IDs
        try {
            validateCodingProfiles(leetcodeProfile, codeforcesProfile, codechefProfile);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        // Step 1: Check if the user already exists
        const existingUser = await user.findOne({ admissionNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Step 3: Generate a verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        if (admissionNumber.toLowerCase() !== instituteEmail.split('@')[0]) {
            return res.status(400).json({ message: 'Email does not match with email' });

        }

        // Step 4: Create a new user with the token and save to DB
        const newUser = new user({
            fullName,
            admissionNumber,
            mobileNumber,
            personalEmail,
            instituteEmail,
            branch,
            linkedInProfile,
            githubProfile,
            leetcodeProfile,
            codeforcesProfile,
            codechefProfile,
            shareCodingProfile,  // New field for CodeChef profile
            password,
            verificationToken
        });

        await newUser.save();

        // Step 5: Send verification email...
        // Step 5: Send verification email


        const verificationUrl = `${req.headers.referer}auth/verify/${verificationToken}`;

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: instituteEmail,
            subject: 'Verify your Email',
            text: `Click the link to verify your email: ${verificationUrl}`,
            html:
                `<div style=" background-color: black; color:white; font-size:12px; padding:20px;">
               <div style="margin-bottom: 25px; display:flex; justify-content: center;"><img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="width:350px"/></div>
               <div> Dear ${fullName},</div>
               <p style="">Thank you for registering on NEXUS portal. Please verify your email using following link.</p>
               <button style="background-color:skyblue; border-radius:15px; padding:10px; border: none; outline: none;"> <a href="${verificationUrl}" style="color:black">Verify Your Email</a></button>
               <p> Thanks,<br>Team NEXUS</p>
               </div>`

        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'User registered. Verification email sent!' });


    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


const verifyEmail = async (req, res) => {
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


const getUserProfile = async (req, res) => {
    try {
        // Assuming the authenticated user's ID is stored in req.user.id (set by auth middleware)
        const userId = req.user.id;

        // Step 1: Find the user by their ID
        const foundUser = await user.findById(userId).select('-password -verificationToken'); // Exclude password and token

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 2: Return the user profile data
        res.status(200).json(foundUser);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            fullName,
            mobileNumber,
            personalEmail,
            branch,
            linkedInProfile,
            currentCompany,
            currentDesignation,
            expertise,
            githubProfile,
            leetcodeProfile,
            codeforcesProfile,
            codechefProfile,
            shareCodingProfile,  // Include codechefProfile in the request body
            subscribed
        } = req.body;

        // Validate coding profile IDs
        try {
            validateCodingProfiles(leetcodeProfile, codeforcesProfile, codechefProfile);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        // Step 1: Find the user by their ID
        let foundUser = await user.findById(userId);

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 2: Update the fields
        foundUser.fullName = fullName || foundUser.fullName;
        foundUser.mobileNumber = mobileNumber || foundUser.mobileNumber;
        foundUser.personalEmail = personalEmail || foundUser.personalEmail;
        foundUser.branch = branch || foundUser.branch;
        foundUser.linkedInProfile = linkedInProfile || foundUser.linkedInProfile;
        foundUser.githubProfile = githubProfile || foundUser.githubProfile;
        foundUser.leetcodeProfile = leetcodeProfile || foundUser.leetcodeProfile;
        foundUser.codeforcesProfile = codeforcesProfile || foundUser.codeforcesProfile;
        foundUser.codechefProfile = codechefProfile || foundUser.codechefProfile;  // Update codechefProfile
        foundUser.subscribed = subscribed;
        foundUser.shareCodingProfile = shareCodingProfile;
        foundUser.currentCompany = currentCompany || foundUser.currentCompany;
        foundUser.currentDesignation = currentDesignation || foundUser.currentDesignation;
        foundUser.expertise = expertise || foundUser.expertise;


        // Step 3: Save the updated user profile
        await foundUser.save();

        res.status(200).json({ message: 'Profile updated successfully', user: foundUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};



const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortField = req.query.sortBy || 'fullName';
        const sortOrder = req.query.order === 'desc' ? -1 : 1;
        const searchQuery = req.query.search || '';
        const branchFilter = req.query.branch || 'all';
        const yearFilter = req.query.year || 'all';

        // Create search query
        const searchConditions = {
            emailVerified: true,
        };

        // Add search conditions
        if (searchQuery) {
            searchConditions.$or = [
                { fullName: { $regex: searchQuery, $options: 'i' } },
                { admissionNumber: { $regex: searchQuery, $options: 'i' } },
                { branch: { $regex: searchQuery, $options: 'i' } },
                { personalEmail: { $regex: searchQuery, $options: 'i' } },
                { instituteEmail: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        // Add branch filter
        if (branchFilter !== 'all') {
            searchConditions.branch = { $regex: branchFilter, $options: 'i' };
        }

        // Add year filter
        if (yearFilter !== 'all') {
            const yearPattern = yearFilter.slice(2); // Get last two digits of year
            searchConditions.admissionNumber = {
                $regex: `^[UI]${yearPattern}`,
                $options: 'i'
            };
        }

        const users = await user.find(
            searchConditions,
            '-password -verificationToken -resetPasswordToken -resetPasswordExpires -emailVerified -subscribed -__v'
        )
            .sort({ [sortField]: sortOrder })
            .skip(limit === 1000000 ? 0 : (page - 1) * limit) // Skip pagination if downloading all
            .limit(limit);

        const totalUsers = await user.countDocuments(searchConditions);

        res.status(200).json({
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
}

const getUsers = async (req, res) => {
    try {
        const sortField = req.query.sortBy || 'admissionNumber'; // Sort field
        const sortOrder = req.query.order === 'desc' ? -1 : 1; // Sort order

        const users = await user.find({ emailVerified: true, shareCodingProfile: true }, '-password -verificationToken -resetPasswordToken -resetPasswordExpires -emailVerified -subscribed -__v')
            .sort({ [sortField]: sortOrder }) // Sorting by field and order


        res.status(200).json({
            users
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
}

const forgotPassword = async (req, res) => {
    const { admissionNumber } = req.body;

    try {
        const foundUser = await user.findOne({ admissionNumber });
        if (!foundUser) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Step 1: Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpire = Date.now() + 3600000; // Token expires in 1 hour

        foundUser.resetPasswordToken = resetToken;
        foundUser.resetPasswordExpires = resetTokenExpire;

        await foundUser.save();

        // Step 2: Send reset email
        const resetUrl = `${req.headers.referer}auth/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: foundUser.personalEmail,
            subject: 'Password Reset Request',
            html: `
                <div style="background-color: black; color:white; font-size:12px; padding:20px;">
                    <div style="margin-bottom: 25px; display:flex; justify-conte350px center;">
                        <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="width:80%"/>
                    </div>
                    <div> Dear ${foundUser.fullName},</div>
                    <p>You requested a password reset. Click the link below to reset your password:</p>
                    <button style="background-color:skyblue; border-radius:15px; padding:10px; border: none; outline: none;">
                        <a href="${resetUrl}" style="color:black">Reset Password</a>
                    </button>
                    <p>If you did not request this, please ignore this email.</p>
                    <p> Thanks,<br>Team NEXUS</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset email sent' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


const verifyPasswordResetEmail = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Step 1: Find user by token and check if token is still valid
        const foundUser = await user.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }  // Ensure token hasn't expired
        });
        if (!foundUser) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        // Step 2: Verify the email
        foundUser.emailVerified = true;
        foundUser.password = newPassword;
        foundUser.resetPasswordToken = undefined;
        foundUser.resetPasswordExpires = undefined;

        await foundUser.save();

        res.status(200).json({ message: 'Password Reset Successfully' });

    } catch (error) {
        console.error('Error reseting password:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Step 1: Find user by reset token and check if it's expired
        const foundUser = await user.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Check if token is not expired
        });

        if (!foundUser) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Step 2: Hash the new password and save it
        const hashedPassword = await bcrypt.hash(password, 10);
        foundUser.password = hashedPassword;

        // Step 3: Invalidate the reset token and reset expiration time
        foundUser.resetPasswordToken = undefined;
        foundUser.resetPasswordExpires = undefined;

        // Step 4: Mark the institute email as unverified
        foundUser.emailVerified = false;

        await foundUser.save();

        // Step 5: Send re-verification email
        const verificationToken = crypto.randomBytes(32).toString('hex');
        foundUser.verificationToken = verificationToken;

        const verificationUrl = `${req.headers.referer}auth/verify/${verificationToken}`;
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: foundUser.instituteEmail,
            subject: 'Re-verify your Email',
            html: `
                <div style="background-color: black; color:white; font-size:12px; padding:20px;">
                    <div style="margin-bottom: 25px; display:flex; justify-conte350px center;">
                        <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="width:80%"/>
                    </div>
                    <div> Dear ${foundUser.fullName},</div>
                    <p>Your password has been successfully reset. Please verify your email again using the link below:</p>
                    <button style="background-color:skyblue; border-radius:15px; padding:10px; border: none; outline: none;">
                        <a href="${verificationUrl}" style="color:black">Verify Your Email</a>
                    </button>
                    <p> Thanks,<br>Team NEXUS</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset successfully. Verification email sent.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Personalised email template in backend
const buildEmailTemplate = (name, content) => `
  <div style="background-color: black; color: white; font-size: 14px; padding: 20px; font-family: Arial, sans-serif;">
    <div style="background-color: #333; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="display: block; margin: auto; max-width: 100%; height: auto;"/>
      <p><h3 style="color: white;">Dear ${name || 'User'},</h3></p>
      <p style="color: #ccc;">${content}</p>
      <p style="color: #ccc;">Visit <a href="https://www.nexus-svnit.in" style="color: #1a73e8;">this link</a> for more details.</p>
      <p>Thanks,<br>Team NEXUS</p>
    </div>
    <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
      <p>Contact us: <a href="mailto:nexus@coed.svnit.ac.in" style="color: #1a73e8;">nexus@coed.svnit.ac.in</a></p>
      <p>Follow us on <a href="https://www.linkedin.com/company/nexus-svnit/" style="color: #1a73e8;">LinkedIn</a> <a href="https://www.instagram.com/nexus_svnit/" style="color: #1a73e8;">Instagram</a></p>
    </div>
  </div>
`;

const notifyBatch = async (req, res) => {
  try {
    const { subject, message, batches } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'subject and message are required' });
    }

    // Parse prefixes like "u22,i25"
    const rawBatches = Array.isArray(batches) ? batches : String(batches || '').split(',');
    const prefixes = [...new Set(
      rawBatches
        .map(b => String(b).trim().toLowerCase())
        .filter(b => /^[ui][0-9]{2}$/.test(b))
    )];

    if (!prefixes.length) {
      return res.status(400).json({ message: 'Invalid batch values. Use prefixes like "u22" or "i25".' });
    }

    const regex = new RegExp(`^(${prefixes.join('|')})`, 'i');

    // Fetch recipients with name + email, only verified users with a personal email
    const recipients = await user.find(
      {
        emailVerified: true,
        admissionNumber: { $regex: regex },
        personalEmail: { $exists: true, $ne: '' }
      },
      { personalEmail: 1, fullName: 1, _id: 0 }
    ).lean();

    if (!recipients.length) {
      return res.status(404).json({ message: 'No users found for selected batches' });
    }

    // De-duplicate by email (keep first name seen)
    const uniqueMap = new Map();
    for (const r of recipients) {
      const email = r.personalEmail?.trim();
      if (email && !uniqueMap.has(email)) uniqueMap.set(email, r.fullName || 'User');
    }

    let sentCount = 0;
    for (const [email, name] of uniqueMap.entries()) {
      const html = buildEmailTemplate(name, message);
      await transporter.sendMail({
        from: `"Team Nexus" <${process.env.EMAIL_ID}>`,
        to: email, // send individually to personalize salutation
        subject,
        html
      });
      sentCount++;
    }

    console.log(`Sent ${sentCount} emails to ${uniqueMap.size} unique recipients`);

    return res.status(200).json({
      message: 'Batch notification sent',
      totalRecipients: sentCount,
      batches: prefixes
    });
  } catch (error) {
    console.error('notify-batch error:', error);
    return res.status(500).json({ message: 'Error notifying batch users' });
  }
};

const getUserStats = async (req, res) => {
    try {
        const totalUsers = await user.countDocuments({ emailVerified: true });

        // Get branch-wise stats
        const branchStats = await user.aggregate([
            { $match: { emailVerified: true } },
            { $group: { _id: "$branch", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Get year-wise stats
        const yearStats = await user.aggregate([
            { $match: { emailVerified: true } },
            {
                $project: {
                    year: {
                        $substr: ["$admissionNumber", 1, 2]
                    }
                }
            },
            { $group: { _id: "$year", count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);

        // Calculate month-over-month growth
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);

        const currentMonthUsers = await user.countDocuments({
            emailVerified: true,
            createdAt: { $gte: lastMonth }
        });

        const growthRate = ((currentMonthUsers / totalUsers) * 100).toFixed(2);

        // Get profile completion stats
        const profileStats = await user.aggregate([
            { $match: { emailVerified: true } },
            {
                $project: {
                    completionRate: {
                        $multiply: [
                            {
                                $divide: [
                                    {
                                        $add: [
                                            { $cond: [{ $gt: ["$githubProfile", ""] }, 1, 0] },
                                            { $cond: [{ $gt: ["$linkedInProfile", ""] }, 1, 0] },
                                            { $cond: [{ $gt: ["$leetcodeProfile", ""] }, 1, 0] },
                                            { $cond: [{ $gt: ["$codeforcesProfile", ""] }, 1, 0] },
                                            { $cond: [{ $gt: ["$codechefProfile", ""] }, 1, 0] }
                                        ]
                                    },
                                    5
                                ]
                            },
                            100
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgCompletionRate: { $avg: "$completionRate" }
                }
            }
        ]);

        res.status(200).json({
            totalUsers,
            branchStats,
            yearStats,
            growthRate,
            profileCompletionRate: profileStats[0]?.avgCompletionRate.toFixed(2) || 0,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user statistics', error });
    }
};

const getPendingAlumni = async (req, res) => {
    try {
        const pendingAlumni = await user.find({
            isAlumni: true,
            emailVerified: true,
            isVerified: false
        });
        res.status(200).json(pendingAlumni);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending alumni', error });
    }
};

const verifyAlumni = async (req, res) => {
    try {
        const { id } = req.params;
        const alumniUser = await user.findById(id);

        if (!alumniUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        alumniUser.isVerified = true;
        await alumniUser.save();

        // Send verification email
        const emailContent = alumniVerificationTemplate(alumniUser.fullName);
        await transporter.sendMail({
            ...emailContent,
            to: alumniUser.personalEmail
        });

        res.status(200).json({ message: 'Alumni verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying alumni', error });
    }
};

const rejectAlumni = async (req, res) => {
    try {
        const { id } = req.params;
        const alumniUser = await user.findById(id);

        if (!alumniUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send rejection email
        const emailContent = alumniRejectionTemplate(alumniUser.fullName);
        await transporter.sendMail({
            ...emailContent,
            to: alumniUser.personalEmail
        });

        await user.findByIdAndDelete(id);
        res.status(200).json({ message: 'Alumni rejected successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting alumni', error });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile, getAllUsers,
    loginUser, signupUser, verifyEmail,
    forgotPassword, verifyPasswordResetEmail,
    resetPassword,
    // generalNotification,
    getUsers,
    getUserStats,
    getPendingAlumni,
    verifyAlumni,
    rejectAlumni,
    notifyBatch // new export
};