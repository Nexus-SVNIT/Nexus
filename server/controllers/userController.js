const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const user = require('../models/userModel.js');
const bcrypt = require('bcrypt')

const createToken = (id) => {
    return jwt.sign({ id }, "jldsjlgjslgjl", { expiresIn: '3d' });
}

// const loginUser = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const currentUser = await user.login(email, password)
//         const token = createToken(currentUser._id);
//         res.status(200).json({ email, token });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// }

// const loginUser = async (req, res) => {
//     const { admissionNumber, password } = req.body;
//     try {
//       // Step 1: Find user by admission number
//       const foundUser = await user.findOne({ admissionNumber });
//       if (!foundUser) {
//         return res.status(400).json({ message: 'User not found' });
//       }
  
//       // Step 2: Compare the password
//       const isMatch = await foundUser.comparePassword(password);
//       if (!isMatch) {
//         return res.status(400).json({ message: 'Invalid credentials' });
//       }
  
//       // Step 3: Generate a JWT token
//       const token = jwt.sign(
//         { id: foundUser._id, admissionNumber: foundUser.admissionNumber },
//         process.env.SECRET,  // Store your JWT secret securely
//         { expiresIn: '1h' }
//       );
  
//       // Step 4: Return the token to the frontend
//       res.status(200).json({ message: 'Login successful', token });
  
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error', error });
//     }
//   };


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

  


// const signupUser = async (req, res) => {
//     const { fullName, admissionNumber, mobileNumber, personalEmail, instituteEmail, branch, linkedInProfile, githubProfile, leetcodeProfile, codeforcesProfile, password } = req.body;

//     try {
//         // Step 1: Check if the user already exists
//         const existingUser = await user.findOne({ personalEmail });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Step 2: Hash the password
        

//         // Step 3: Create a new user
//         const newUser = new user({
//             fullName,
//             admissionNumber,
//             mobileNumber,
//             personalEmail,
//             instituteEmail,
//             branch,
//             linkedInProfile,
//             githubProfile,
//             leetcodeProfile,
//             codeforcesProfile,
//             password
//         });

//         // Step 4: Save the user to the database
//         await newUser.save();

//         // Step 5: Generate a JWT token
//         const token = jwt.sign(
//             { id: newUser._id, admissionNumber: newUser.admissionNumber },
//             process.env.SECRET, // Ensure this is securely stored
//             { expiresIn: '1h' }
//         );

//         // Step 6: Return success response
//         res.status(201).json({ message: 'User registered successfully', token });

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ message: 'Server error', error });
//     }
// }


const signupUser = async (req, res) => {
    const { fullName, admissionNumber, mobileNumber, personalEmail, instituteEmail, branch, linkedInProfile, githubProfile, leetcodeProfile, codeforcesProfile, password } = req.body;

    try {
        // Step 1: Check if the user already exists
        const existingUser = await user.findOne({ personalEmail });
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
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'nexus@coed.svnit.ac.in',
                pass: 'xzdy vuhr zdss jvpk'
            }
        });

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

module.exports = {
    getUserProfile,
    updateUserProfile,
    loginUser, signupUser, verifyEmail
};