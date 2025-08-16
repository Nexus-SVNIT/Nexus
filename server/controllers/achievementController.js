const fs = require('fs');
const { google } = require('googleapis');
const Achievement = require('../models/achievementModel');
const userSchema = require('../models/userModel');
const { sendEmail } = require('../utils/emailUtils');
const { achievementSubmissionTemplate } = require('../utils/emailTemplates');
const { uploadImageToDrive, deleteFileFromDrive } = require('../utils/driveUtils');



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
  
  


const pendingAchievements = async (req, res) => {
    const achievements = await Achievement.find({ isVerified: false }).sort({ createdAt: 1 }).select('-isVerified');
    return res.status(200).json(achievements);
};

const addAchievement = async (req, res) => {
    try {
        const uploadResult = await uploadImageToDrive(req);
        if (!uploadResult.success) {
            return res.status(500).json({ message: `Error uploading file: ${uploadResult.error}` });
        }

        // Parse teamMembers and ensure it's an array of strings (admission numbers)
        const teamMembersArray = JSON.parse(req.body.teamMembers);

        const achievement = {
            admissionNumber: req.user.admissionNumber,
            teamMembers: teamMembersArray,
            desc: req.body.desc,
            image: uploadResult.fileId,
            proof: req.body.proof,
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

        return res.status(200).json({ message: "Waiting for Review" });
    } catch (err) {
        console.error('Error adding achievement:', err.message);
        return res.status(500).json({ message: "Error adding achievement", error: err.message });
    }
};

// Add this new function to delete achievements with Drive cleanup
const deleteAchievement = async (req, res) => {
    try {
        const achievementId = req.params.id;
        
        // Find the achievement to get the image ID
        const achievement = await Achievement.findById(achievementId);
        
        if (!achievement) {
            return res.status(404).json({ message: "Achievement not found" });
        }
        
        // Check if user has permission to delete
        if (req.user.admissionNumber !== achievement.admissionNumber && !req.user.isAdmin) {
            return res.status(403).json({ message: "Not authorized to delete this achievement" });
        }
        
        // Delete the image from Google Drive if it exists
        if (achievement.image) {
            await deleteFileFromDrive(achievement.image);
        }
        
        // Delete the achievement from the database
        await Achievement.findByIdAndDelete(achievementId);
        
        return res.status(200).json({ message: "Achievement deleted successfully" });
    } catch (err) {
        console.error('Error deleting achievement:', err.message);
        return res.status(500).json({ message: "Error deleting achievement", error: err.message });
    }
};

const verifyAchievement = async (req, res) => {
    const achievementId = req.params.id;
    try {
        const updatedAchievement = await Achievement.findByIdAndUpdate(
            achievementId,
            { isVerified: true },
            { new: true, runValidators: true }
        );

        if (!updatedAchievement) {
            return res.status(404).json({ Message: "Achievement not found" });
        }

        return res.status(200).json({ Message: "Achievement verified successfully", achievement: updatedAchievement });
    } catch (err) {
        console.error('Error verifying achievement:', err.message);
        return res.status(500).json({ Message: "Error verifying achievement", error: err.message });
    }
};

const unverifyAchievement = async (req, res) => {
    const achievementId = req.params.id;
    try {
        const updatedAchievement = await Achievement.findByIdAndUpdate(
            achievementId,
            { isVerified: false },
            { new: true, runValidators: true }
        );

        if (!updatedAchievement) {
            return res.status(404).json({ Message: "Achievement not found" });
        }

        return res.status(200).json({ Message: "Achievement unverified successfully", achievement: updatedAchievement });
    } catch (err) {
        console.error('Error un-verifying achievement:', err.message);
        return res.status(500).json({ Message: "Error un-verifying achievement", error: err.message });
    }
};

module.exports = { allAchievements, addAchievement, pendingAchievements, verifyAchievement, unverifyAchievement, deleteAchievement };

