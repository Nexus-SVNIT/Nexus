const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const user = require('../models/userModel.js');
const fs = require('fs');
const { sendEmail } = require('../utils/emailUtils.js');
const { validateCodingProfiles } = require('../utils/validateCodingProfiles.js');
const { 
    alumniEmailVerificationTemplate, 
    alumniEmailVerifiedTemplate, 
    signupEmailTemplate, 
    forgotPasswordTemplate 
} = require('../utils/emailTemplates.js');
const { validateAlumni } = require('../utils/validateAlumni');

/**
 * Extracts frontend origin URL reliably from env or request headers
 */
const getFrontendBaseUrl = (req) => {
    const raw = process.env.FRONTEND_URL || req.headers.origin || req.headers.referer || 'https://www.nexus-svnit.in';
    try {
        const parsed = new URL(raw);
        return parsed.origin;
    } catch {
        return raw.replace(/\/+$/, '');
    }
};

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

        const token = jwt.sign(payload, process.env.SECRET || 'fallback_secret_key', {
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
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const signupUser = async (req, res) => {
    const { 
        fullName, admissionNumber, mobileNumber, personalEmail, instituteEmail, 
        branch, linkedInProfile, githubProfile, leetcodeProfile, codeforcesProfile, 
        codechefProfile, password, shareCodingProfile 
    } = req.body;

    try {
        // Validate coding profile IDs (URL check + existence verification)
        try {
            const result = await validateCodingProfiles(leetcodeProfile, codeforcesProfile, codechefProfile);
            if (!result.valid) {
                return res.status(400).json({ message: result.errors.join(', ') });
            }
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        // Step 1: Check if the user already exists
        const existingUser = await user.findOne({ admissionNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Step 2: Validate institute email match
        if (!instituteEmail || admissionNumber.toLowerCase() !== instituteEmail.split('@')[0].toLowerCase()) {
            return res.status(400).json({ message: 'Admission number does not match institute email' });
        }

        // Step 3: Generate a verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

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
            shareCodingProfile,
            password,
            verificationToken
        });

        await newUser.save();

        // Step 5: Send verification email
        const baseUrl = getFrontendBaseUrl(req);
        const verificationUrl = `${baseUrl}/auth/verify/${verificationToken}`;

        const emailContent = signupEmailTemplate({
            fullName,
            verificationUrl
        });

        try {
            await sendEmail({
                to: instituteEmail,
                ...emailContent,
                critical: true
            });
        } catch (emailError) {
            // Roll back user creation so the user isn't stuck with "User already exists" while unverified
            await user.findByIdAndDelete(newUser._id);
            console.error('Signup verification email error:', emailError);
            return res.status(500).json({ 
                message: 'Failed to send verification email. Please check your email credentials or try again later.' 
            });
        }

        res.status(201).json({ message: 'User registered. Verification email sent!' });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const signUpAlumni = async (req, res) => {
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

        // Validate coding profiles
        try {
            const result = await validateCodingProfiles(req.body['LeetcodeId'], req.body['codeforcesId'], null);
            if (!result.valid) {
                return res.status(400).json({
                    success: false,
                    message: result.errors.join(', ')
                });
            }
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

        // Generate email verification token
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

        // Create verification link
        const baseUrl = getFrontendBaseUrl(req);
        const verificationUrl = `${baseUrl}/auth/verify/alumni/${verificationToken}`;

        const emailContent = alumniEmailVerificationTemplate({
            fullName: req.body['fullName'],
            verificationUrl,
        });

        try {
            await sendEmail({
                to: req.body['personalEmail'],
                ...emailContent,
                critical: true
            });
        } catch (emailError) {
            await user.findByIdAndDelete(newAlumni._id);
            console.error('Alumni verification email error:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Failed to send verification email. Please try again later.'
            });
        }

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
        res.status(500).json({ message: 'Server error', error: error.message });
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

        // Non-blocking notification email
        const emailContent = alumniEmailVerifiedTemplate({
            fullName: userData.fullName
        });

        await sendEmail({
            to: userData.personalEmail,
            ...emailContent,
            critical: false
        });

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verify alumni email error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
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
        const baseUrl = getFrontendBaseUrl(req);
        const resetUrl = `${baseUrl}/auth/reset-password/${resetToken}`;
        
        const emailContent = forgotPasswordTemplate({
            fullName: foundUser.fullName,
            resetUrl
        });

        await sendEmail({
            to: foundUser.personalEmail,
            ...emailContent,
            critical: true
        });

        res.status(200).json({ message: 'Password reset email sent' });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Failed to send password reset email', error: error.message });
    }
};

const verifyPasswordResetEmail = async (req, res) => {
    const { token } = req.params;
    const { newPassword, password } = req.body;
    const passwordToSet = newPassword || password;

    try {
        if (!passwordToSet) {
            return res.status(400).json({ message: 'New password is required' });
        }

        // Step 1: Find user by token and check if token is still valid
        const foundUser = await user.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }  // Ensure token hasn't expired
        });
        if (!foundUser) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        // Step 2: Set raw password - pre('save') hook handles hashing!
        foundUser.emailVerified = true;
        foundUser.password = passwordToSet;
        foundUser.resetPasswordToken = undefined;
        foundUser.resetPasswordExpires = undefined;

        await foundUser.save();

        res.status(200).json({ message: 'Password Reset Successfully' });

    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const token = req.params.token || req.body.token;
    const { password, newPassword } = req.body;
    const passwordToSet = password || newPassword;

    try {
        if (!token) {
            return res.status(400).json({ message: 'Reset token is required' });
        }

        if (!passwordToSet) {
            return res.status(400).json({ message: 'New password is required' });
        }

        // Step 1: Find user by reset token and check if it's expired
        const foundUser = await user.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!foundUser) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Step 2: Assign raw password - userSchema pre('save') hook handles hashing!
        foundUser.password = passwordToSet;
        foundUser.resetPasswordToken = undefined;
        foundUser.resetPasswordExpires = undefined;
        foundUser.emailVerified = true;

        await foundUser.save();

        res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const resendVerificationEmail = async (req, res) => {
    const { admissionNumber, email } = req.body;

    try {
        if (!admissionNumber && !email) {
            return res.status(400).json({ message: 'Please provide your admission number or email' });
        }

        const query = admissionNumber 
            ? { admissionNumber } 
            : { $or: [{ personalEmail: email }, { instituteEmail: email }] };

        const foundUser = await user.findOne(query);
        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (foundUser.emailVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        foundUser.verificationToken = verificationToken;
        await foundUser.save();

        const baseUrl = getFrontendBaseUrl(req);
        if (foundUser.isAlumni) {
            const verificationUrl = `${baseUrl}/auth/verify/alumni/${verificationToken}`;
            const emailContent = alumniEmailVerificationTemplate({
                fullName: foundUser.fullName,
                verificationUrl
            });
            await sendEmail({
                to: foundUser.personalEmail,
                ...emailContent,
                critical: true
            });
        } else {
            const verificationUrl = `${baseUrl}/auth/verify/${verificationToken}`;
            const emailContent = signupEmailTemplate({
                fullName: foundUser.fullName,
                verificationUrl
            });
            await sendEmail({
                to: foundUser.instituteEmail || foundUser.personalEmail,
                ...emailContent,
                critical: true
            });
        }

        res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ message: 'Failed to resend verification email', error: error.message });
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
    resendVerificationEmail,
};