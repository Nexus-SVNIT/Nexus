const user = require('../models/userModel.js');
const { validateCodingProfiles } = require('../utils/validateCodingProfiles.js');
const Post = require('../models/postModel.js');

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
            shareCodingProfile,
            subscribed
        } = req.body;

        // Step 1: Find the user by their ID
        let foundUser = await user.findById(userId);

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 2: Only verify coding profiles that have actually changed
        const leetcodeToVerify = (leetcodeProfile && leetcodeProfile !== foundUser.leetcodeProfile) ? leetcodeProfile : null;
        const codeforcesToVerify = (codeforcesProfile && codeforcesProfile !== foundUser.codeforcesProfile) ? codeforcesProfile : null;
        const codechefToVerify = (codechefProfile && codechefProfile !== foundUser.codechefProfile) ? codechefProfile : null;

        // Validate changed coding profile IDs (URL check + existence verification)
        if (leetcodeToVerify || codeforcesToVerify || codechefToVerify) {
            try {
                const result = await validateCodingProfiles(
                    leetcodeToVerify,
                    codeforcesToVerify,
                    codechefToVerify
                );
                if (!result.valid) {
                    return res.status(400).json({ message: result.errors.join(', ') });
                }
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
        }

        // Step 3: Update the fields
        foundUser.fullName = fullName || foundUser.fullName;
        foundUser.mobileNumber = mobileNumber || foundUser.mobileNumber;
        foundUser.personalEmail = personalEmail || foundUser.personalEmail;
        foundUser.branch = branch || foundUser.branch;
        foundUser.linkedInProfile = linkedInProfile || foundUser.linkedInProfile;
        foundUser.githubProfile = githubProfile || foundUser.githubProfile;
        foundUser.leetcodeProfile = leetcodeProfile || foundUser.leetcodeProfile;
        foundUser.codeforcesProfile = codeforcesProfile || foundUser.codeforcesProfile;
        foundUser.codechefProfile = codechefProfile || foundUser.codechefProfile;
        foundUser.subscribed = subscribed;
        foundUser.shareCodingProfile = shareCodingProfile;
        foundUser.currentCompany = currentCompany || foundUser.currentCompany;
        foundUser.currentDesignation = currentDesignation || foundUser.currentDesignation;
        foundUser.expertise = expertise || foundUser.expertise;


        // Step 4: Save the updated user profile
        await foundUser.save();

        res.status(200).json({ message: 'Profile updated successfully', user: foundUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user.id })
            .sort({ createdAt: -1 })
            .select('title company role createdAt');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getUserPosts
};