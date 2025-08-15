const mongoose = require('mongoose');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const user = require('../models/userModel.js');
const bcrypt = require('bcrypt')
const { sendEmail } = require('../utils/emailUtils.js'); 
const { validateCodingProfiles } = require('../utils/validateCodingProfiles.js');
const { alumniVerificationTemplate, alumniRejectionTemplate, personalizedBatchTemplate } = require('../utils/emailTemplates.js');



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

        // CHANGE: await transporter.sendMail(mailOptions);
        await sendEmail(mailOptions);

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

        // CHANGE: await transporter.sendMail(mailOptions);
        await sendEmail(mailOptions);

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

        // CHANGE: await transporter.sendMail(mailOptions);
        await sendEmail(mailOptions);

        res.status(200).json({ message: 'Password reset successfully. Verification email sent.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// REMOVE buildEmailTemplate from controller (moved to utils as personalizedBatchTemplate)
// Personalised email template in backend
// const buildEmailTemplate = (name, content) => `
//   <div style="background-color: black; color: white; font-size: 14px; padding: 20px; font-family: Arial, sans-serif;">
//     <div style="background-color: #333; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
//       <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="display: block; margin: auto; max-width: 100%; height: auto;"/>
//       <p><h3 style="color: white;">Dear ${name || 'User'},</h3></p>
//       <p style="color: #ccc;">${content}</p>
//       <p style="color: #ccc;">Visit <a href="https://www.nexus-svnit.in" style="color: #1a73e8;">this link</a> for more details.</p>
//       <p>Thanks,<br>Team NEXUS</p>
//     </div>
//     <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
//       <p>Contact us: <a href="mailto:nexus@coed.svnit.ac.in" style="color: #1a73e8;">nexus@coed.svnit.ac.in</a></p>
//       <p>Follow us on <a href="https://www.linkedin.com/company/nexus-svnit/" style="color: #1a73e8;">LinkedIn</a> <a href="https://www.instagram.com/nexus_svnit/" style="color: #1a73e8;">Instagram</a></p>
//     </div>
//   </div>
// `;

const notifyBatch = async (req, res) => {
  try {
    // Extract data with fallbacks for different possible field names
    const subject = req.body.subject || req.body.emailSubject || '';
    const message = req.body.message || req.body.content || req.body.emailContent || req.body.body || '';
    const recipients = req.body.batches || req.body.recipients || req.body.to || req.body.emails || '';

    // Log incoming request data for debugging
    console.log('Notification request received:', { 
      subject, 
      messageLength: message?.length,
      recipients: typeof recipients === 'string' ? recipients : 
                  Array.isArray(recipients) ? JSON.stringify(recipients) : typeof recipients
    });

    if (!subject || !message) {
      return res.status(400).json({ message: 'Email subject and message content are required' });
    }

    // Parse recipients (batch prefixes or emails)
    const rawInputs = Array.isArray(recipients) ? recipients : String(recipients || '').split(',');
    const inputs = rawInputs.map(b => String(b).trim()).filter(Boolean);
    
    if (!inputs.length) {
      return res.status(400).json({ message: 'Please provide at least one batch prefix or email address' });
    }

    console.log('Parsed inputs:', inputs);

    // Separate inputs into different types: batch prefixes, specific admission numbers, and emails
    const prefixes = [];
    const admissionNumbers = [];
    const directEmails = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    inputs.forEach(input => {
      // If it looks like an email, add to directEmails
      if (emailRegex.test(input)) {
        directEmails.push(input.toLowerCase());
        console.log(`Valid email found: ${input}`);
      } 
      // Check if it looks like a complete admission number (u/i followed by 6-8 characters)
      else if (/^[ui][a-z0-9]{6,8}$/i.test(input)) {
        admissionNumbers.push(input.toLowerCase());
        console.log(`Specific admission number found: ${input}`);
      }
      // Otherwise treat it as a batch prefix (u22, i22cs, etc.)
      else if (/^[ui][a-z0-9]+$/i.test(input)) {
        prefixes.push(input.toLowerCase());
        console.log(`Batch prefix found: ${input}`);
      } else {
        console.log(`Invalid input (neither email, admission number, nor batch prefix): ${input}`);
      }
    });

    console.log(`Found ${prefixes.length} batch prefixes, ${admissionNumbers.length} specific admission numbers, and ${directEmails.length} direct emails`);

    let recipients_list = [];
    let batches_matched = [];
    let matched_admissions = [];
    
    // If we have specific admission numbers, query those users directly with exact match
    if (admissionNumbers.length > 0) {
      const admissionRecipients = await user.find(
        {
          emailVerified: true,
          admissionNumber: { $in: admissionNumbers }, // Exact match
          personalEmail: { $exists: true, $ne: '' }
        },
        { personalEmail: 1, fullName: 1, admissionNumber: 1, _id: 0 }
      ).lean();
      
      console.log(`Found ${admissionRecipients.length} users with specific admission numbers`);
      if (admissionRecipients.length > 0) {
        matched_admissions = admissionRecipients.map(r => r.admissionNumber);
        console.log('Matched admission numbers:', matched_admissions);
      }
      recipients_list = [...recipients_list, ...admissionRecipients];
    }
    
    // If we have batch prefixes, query users matching those prefixes
    if (prefixes.length > 0) {
      const regex = new RegExp(`^(${prefixes.join('|')})`, 'i');
      batches_matched = prefixes;
      
      const batchRecipients = await user.find(
        {
          emailVerified: true,
          admissionNumber: { $regex: regex },
          personalEmail: { $exists: true, $ne: '' }
        },
        { personalEmail: 1, fullName: 1, _id: 0 }
      ).lean();
      
      console.log(`Found ${batchRecipients.length} users matching batch prefixes`);
      recipients_list = [...recipients_list, ...batchRecipients];
    }

    // Process direct emails - create simpler recipient objects
    if (directEmails.length > 0) {
      const directRecipients = directEmails.map(email => ({ 
        personalEmail: email, 
        fullName: email.split('@')[0] // Use part before @ as name
      }));
      
      console.log(`Adding ${directRecipients.length} direct email recipients`);
      recipients_list = [...recipients_list, ...directRecipients];
    }

    if (!recipients_list.length) {
      return res.status(404).json({ 
        message: 'No recipients found for the provided inputs',
        debug: { 
          inputs,
          prefixes: prefixes.length ? prefixes : 'none', 
          emails: directEmails.length ? directEmails : 'none' 
        }
      });
    }

    // De-duplicate by email (keep first name seen)
    const uniqueMap = new Map();
    for (const r of recipients_list) {
      const email = r.personalEmail?.trim();
      if (email && !uniqueMap.has(email)) uniqueMap.set(email, r.fullName || 'User');
    }

    console.log(`Final recipient count after deduplication: ${uniqueMap.size}`);

    // Send emails with better error handling
    let sentCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const [email, name] of uniqueMap.entries()) {
      try {
        console.log(`Sending email to: ${email}`);
        const html = personalizedBatchTemplate(name, message);
        await sendEmail({                            
          to: email,
          subject,
          html
        });
        sentCount++;
      } catch (emailError) {
        errorCount++;
        console.error(`Error sending to ${email}:`, emailError.message);
        errors.push({ email, error: emailError.message });
      }
    }

    // Respond based on success/failure ratio
    if (sentCount > 0) {
      return res.status(200).json({
        message: `Sent ${sentCount} emails successfully${errorCount > 0 ? ` (${errorCount} failed)` : ''}`,
        totalRecipients: sentCount,
        failedCount: errorCount,
        batches: batches_matched.length > 0 ? batches_matched : undefined,
        directEmails: directEmails.length > 0 ? directEmails : undefined,
        specificAdmissionNumbers: matched_admissions.length > 0 ? matched_admissions : undefined
      });
    } else {
      // If all emails failed, it's likely a configuration issue
      return res.status(500).json({
        message: 'Failed to send any emails - check email configuration',
        error: errors[0]?.error || 'Email authentication error',
        details: 'You may need to create an app-specific password for Gmail'
      });
    }
  } catch (error) {
    console.error('notify-batch error:', error);
    return res.status(500).json({
      message: 'Email configuration error',
      error: error.message,
      details: 'Ensure that your email settings are correct'
    });
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
        // CHANGE: await transporter.sendMail({ ...emailContent, to: alumniUser.personalEmail })
        await sendEmail({ ...emailContent, to: alumniUser.personalEmail });

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
        // CHANGE: await transporter.sendMail({ ...emailContent, to: alumniUser.personalEmail })
        await sendEmail({ ...emailContent, to: alumniUser.personalEmail });

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