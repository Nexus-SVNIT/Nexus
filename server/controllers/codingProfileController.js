const axios = require("axios");
const codingProfileModel = require("../models/codingProfileModel");
const user = require("../models/userModel");

const CODING_PROFILE_API = process.env.CODING_PROFILE_BASE_URL;

const getProfile = async (req, res) => {
    const { platform, userId } = req.params;
    try {
        const profile = await codingProfileModel.findOne({ platform, userId });
        const currentDateTime = new Date();
        if (profile && currentDateTime - profile.updatedAt < 86400000) {
            return res.json(profile);
        }
        const response = await axios.get(`${CODING_PROFILE_API}/user/${platform}/${userId}`);
        const data = response.data;
        if (profile) {
            const newProfile = await codingProfileModel.update
                ({ platform, userId }, { data, updatedAt: currentDateTime });
            res.json(newProfile);
        } else {
            const newProfile = await codingProfileModel.create({ platform, userId, data });
            res.json(newProfile);
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to fetch user data" });
    }
};

const getProfiles = async (req, res) => {
    try {
        const profiles = await codingProfileModel.find();
        const currentDateTime = new Date();
        profiles.forEach(async (profile) => {
            if (currentDateTime - profile.updatedAt > 86400000) {
                const response = await axios.get(`${CODING_PROFILE_API}/user/${profile.platform}/${profile.userId}`);
                const data = response.data;
                await codingProfileModel.update({ platform: profile.platform, userId: profile.userId }, { data, updatedAt: currentDateTime });
            }
        });
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user data" });
    }
};

const getPlatformProfile = async (req, res) => {
    const { platform } = req.params;
    try {
        const users = await user.find({}, { fullName: 1, admissionNumber: 1, [platform + 'Profile']: 1 });
        const profiles = [];
        const currentDateTime = new Date();
        await Promise.all(users.map(async (userDoc) => {
            if (!userDoc[platform + 'Profile']) return;
            const userId = userDoc[platform + "Profile"];
            const profile = await codingProfileModel.findOne({ platform, userId });
            if (profile && currentDateTime - profile.updatedAt < 86400000) {
                profiles.push({
                    ...profile.toObject(),
                    fullName: userDoc.fullName,
                    admissionNumber: userDoc.admissionNumber
                });
            } else {
                const response = await axios.get(`${CODING_PROFILE_API}/user/${platform}/${userId}`);
                const data = response.data?.data || response.data;
                if (profile) {
                    const newProfile = await codingProfileModel.update
                        ({ platform, userId }, { data, updatedAt: currentDateTime });
                    profiles.push({
                        ...newProfile.toObject(),
                        fullName: userDoc.fullName,
                        admissionNumber: userDoc.admissionNumber
                    });
                } else {
                    const newProfile = await codingProfileModel.create({ platform, userId, data });
                    profiles.push({
                        ...newProfile.toObject(),
                        fullName: userDoc.fullName,
                        admissionNumber: userDoc.admissionNumber
                    });
                }
            }
        }));
        res.json(profiles);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to fetch user data" });
    }
};

const getContest = async (req, res) => {
    try {
        const response = await axios.get(`${CODING_PROFILE_API}/contests/upcoming`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching upcoming contests:", error.message);
        res.status(500).json({ error: "Failed to fetch contests" });
    }
}

module.exports = {
    getProfile,
    getProfiles,
    getPlatformProfile,
    getContest
};