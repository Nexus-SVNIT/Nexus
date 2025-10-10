const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const user = require('../models/userModel.js');
const bcrypt = require('bcrypt')
const { sendEmail } = require('../utils/emailUtils.js');
const { validateCodingProfiles } = require('../utils/validateCodingProfiles.js');
const { 
    alumniEmailVerificationTemplate, 
    alumniEmailVerifiedTemplate,
    signupEmailTemplate,
    forgotPasswordTemplate 
} = require('../utils/emailTemplates.js');
const { validateAlumni } = require('../utils/validateAlumni');

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
            fullName: foundUser.fullName,
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

const verifyLogin = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET || 'fallback_secret_key'); // Use your secret key here
        return res.status(200).json({ message: 'Token is valid', decoded });
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}

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

        const { subject, html } = signupEmailTemplate({
            fullName,
            verificationUrl
        });

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: instituteEmail,
            subject,
            html
        };

        // CHANGE: await transporter.sendMail(mailOptions);
        await sendEmail(mailOptions);

        res.status(201).json({ message: 'User registered. Verification email sent!' });


    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const signUpAlumni = async (req, res) => {
    let tempFilePath = req.file?.path;

    try {

        const requiredFields = [
            'fullName', 'personalEmail', 'admissionNumber',
            'currentDesignation', 'currentCompany', 'password',
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
        const existingAlumni = await user.findOne({ admissionNumber: new RegExp(`^${req.body['admissionNumber']}$`, 'i') });
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

        const newAlumni = await user.create(alumniData);

        //  Create verification link
        const verificationUrl = `${req.headers.origin || req.headers.referer}/auth/verify/alumni/${verificationToken}`;

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

const verifyAlumniEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const userData = await user.findOne({ isAlumni: true, verificationToken: token });
        if (!userData) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        userData.emailVerified = true;
        userData.verificationToken = undefined; // Remove the token after verification
        await userData.save();

        const { html, subject } = alumniEmailVerifiedTemplate({

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
        
        const { subject, html } = forgotPasswordTemplate({
            fullName: foundUser.fullName,
            resetUrl
        });
        
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: foundUser.personalEmail,
            subject,
            html
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


module.exports = {
    loginUser,
    signupUser,
    signUpAlumni,
    verifyEmail,
    verifyAlumniEmail,
    forgotPassword,
    verifyPasswordResetEmail,
    resetPassword,
    verifyLogin,
};