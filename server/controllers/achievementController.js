
const Achievement = require('../models/achievementModel');
const userSchema = require('../models/userModel');
const { sendEmail } = require('../utils/emailUtils');
const { achievementSubmissionTemplate } = require('../utils/emailTemplates');
const { uploadImageToDrive } = require('../utils/driveUtils');

const allAchievements = async (req, res) => {
    try {
        // Fetch all verified achievements
        const achievements = await Achievement.find({ isVerified: true })
            .sort({ createdAt: 1 })
            .select('-isVerified');
        // Extract team member admission numbers from achievements
        const allTeamMembers = achievements.flatMap(achievement => achievement.teamMembers);

        // Fetch users corresponding to the team members
        const users = await userSchema.find({ admissionNumber: { $in: allTeamMembers } })
            .select('admissionNumber fullName linkedInProfile'); // Select only needed fields

        // Create a mapping of users by admissionNumber for easy lookup
        const userMap = users.reduce((acc, user) => {
            acc[user.admissionNumber] = user;
            return acc;
        }, {});

        // Combine achievements with user details
        const result = achievements.map(achievement => {
            const teamDetails = achievement.teamMembers.map(member => userMap[member] || null);
            return {
                ...achievement.toObject(), // Convert mongoose document to plain object
                teamMembersDetails: teamDetails // Add user details for team members
            };
        });

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve achievements' });
    }
};

const addAchievement = async (req, res) => {
    try {
        if (!req.user || !req.user.admissionNumber){
            return res.status(401).json({
                message: "User not authenticated or invalid token."
            });
        }
        const imageFile = req.files && req.files['image'] ? req.files['image'][0] : null;
        const proofFile = req.files && req.files['proof'] ? req.files['proof'][0] : null;

        if (!imageFile || !proofFile) {
            return res.status(400).json({ message: 'Image and proof files are required' });
        }
        
        const imageUploadResult = await uploadImageToDrive(imageFile, undefined, req.user.admissionNumber);
        const proofUploadResult = await uploadImageToDrive(proofFile, undefined, req.user.admissionNumber);

        if (!imageUploadResult.success) {
            return res.status(500).json({ message: `Error uploading file: ${imageUploadResult.error}` });
        }
        if (!proofUploadResult.success) {
            return res.status(500).json({ message: `Error uploading file: ${proofUploadResult.error}` });
        }

        // Parse teamMembers and ensure it's an array of strings (admission numbers)
        const teamMembersArray = JSON.parse(req.body.teamMembers);

        const achievement = {
            admissionNumber: req.user.admissionNumber,
            teamMembers: teamMembersArray,
            desc: req.body.desc,
            image: imageUploadResult.fileId,
            proof: `https://drive.google.com/file/d/${proofUploadResult.fileId}`,
        };

        await Achievement.create(achievement);

        const user = await userSchema.findOne({ admissionNumber: req.user.admissionNumber });
        if (!user || !user.instituteEmail) {
            return res.status(400).json({ message: "User email not found" });
        }

        const emailContent = achievementSubmissionTemplate(user.fullName);
        await sendEmail({
            to: user.instituteEmail,
            ...emailContent
        });

        return res.status(200).json({ 
            success: true,
            message: "Waiting for Review" 
        });
    } catch (err) {
        console.error('Error adding achievement:', err.message);
        return res.status(500).json({ message: "Error adding achievement", error: err.message });
    }
};

module.exports = { allAchievements, addAchievement };