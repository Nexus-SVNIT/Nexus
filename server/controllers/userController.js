const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const user = require('../models/userModel.js');
const bcrypt = require('bcrypt')

const createToken = (id) => {
    return jwt.sign({ id }, "jldsjlgjslgjl", { expiresIn: '3d' });
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'nexus@coed.svnit.ac.in',
        pass: 'xzdy vuhr zdss jvpk'
    }
});

const loginUser = async (req, res) => {
    const { admissionNumber, password } = req.body;

    try {
        const foundUser = await user.findOne({ admissionNumber });
        if (!foundUser) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if the user is verified
        if (!foundUser.emailVerified) {
            return res.status(400).json({ message: 'Please verify your email before logging in.' });
        }

        const isMatch = await foundUser.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: foundUser._id, admissionNumber: foundUser.admissionNumber },
            process.env.SECRET,
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


const signupUser = async (req, res) => {
    const { fullName, admissionNumber, mobileNumber, personalEmail, instituteEmail, branch, linkedInProfile, githubProfile, leetcodeProfile, codeforcesProfile, password } = req.body;

    try {
        // Step 1: Check if the user already exists
        const existingUser = await user.findOne({ admissionNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
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
            password,
            verificationToken
        });

        await newUser.save();

        // Step 5: Send verification email


        const verificationUrl = `${req.headers.referer}auth/verify/${verificationToken}`;

        const mailOptions = {
            from: 'nexus@coed.svnit.ac.in',
            to: instituteEmail,
            subject: 'Verify your Email',
            text: `Click the link to verify your email: ${verificationUrl}`,
            html: `
            <div style=" background-color: black; color:white; font-size:20px; padding:20px;">
            <div style="margin:10px; padding:10px; width:90%; display:flex; justify-content: center;"><img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC"/></div>
            <div> Dear ${fullName},</div>
            <p style="">Thank you for registering on NEXUS portal. Please verify your email using following link.</p>
            <button style="background-color:skyblue; border-radius:15px; padding:10px;"> <a href="${verificationUrl}" style="color:black">Verify Your Email</a></button>
            <p> Thanks,<br>Team NEXUS</p>
            </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'User registered. Verification email sent!' });

    } catch (error) {
        console.log(error);
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
        console.log(error);
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
            githubProfile,
            leetcodeProfile,
            codeforcesProfile
        } = req.body;

        // Step 1: Find the user by their ID
        let foundUser = await user.findById(userId);

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 2: Update the fields (except admission number and institute email)
        foundUser.fullName = fullName || foundUser.fullName;
        foundUser.mobileNumber = mobileNumber || foundUser.mobileNumber;
        foundUser.personalEmail = personalEmail || foundUser.personalEmail;
        foundUser.branch = branch || foundUser.branch;
        foundUser.linkedInProfile = linkedInProfile || foundUser.linkedInProfile;
        foundUser.githubProfile = githubProfile || foundUser.githubProfile;
        foundUser.leetcodeProfile = leetcodeProfile || foundUser.leetcodeProfile;
        foundUser.codeforcesProfile = codeforcesProfile || foundUser.codeforcesProfile;

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
        const page = parseInt(req.query.page) || 1; // Current page
        const limit = parseInt(req.query.limit) || 10; // Limit per page
        const sortField = req.query.sortBy || 'fullName'; // Sort field
        const sortOrder = req.query.order === 'desc' ? -1 : 1; // Sort order

        const users = await user.find()
            .sort({ [sortField]: sortOrder }) // Sorting by field and order
            .skip((page - 1) * limit)
            .limit(limit);

        const totalUsers = await user.countDocuments();

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
            from: 'nexus@coed.svnit.ac.in',
            to: foundUser.instituteEmail,
            subject: 'Password Reset Request',
            html: `
                <div style="background-color: black; color:white; font-size:20px; padding:20px;">
                    <div style="margin:10px; padding:10px; width:90%; display:flex; justify-content: center;">
                        <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC"/>
                    </div>
                    <div> Dear ${foundUser.fullName},</div>
                    <p>You requested a password reset. Click the link below to reset your password:</p>
                    <button style="background-color:skyblue; border-radius:15px; padding:10px;">
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
      console.log(foundUser)
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
            from: 'nexus@coed.svnit.ac.in',
            to: foundUser.instituteEmail,
            subject: 'Re-verify your Email',
            html: `
                <div style="background-color: black; color:white; font-size:20px; padding:20px;">
                    <div style="margin:10px; padding:10px; width:90%; display:flex; justify-content: center;">
                        <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC"/>
                    </div>
                    <div> Dear ${foundUser.fullName},</div>
                    <p>Your password has been successfully reset. Please verify your email again using the link below:</p>
                    <button style="background-color:skyblue; border-radius:15px; padding:10px;">
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

module.exports = {
    getUserProfile,
    updateUserProfile, getAllUsers,
    loginUser, signupUser, verifyEmail,
    forgotPassword, verifyPasswordResetEmail,
    resetPassword,
};