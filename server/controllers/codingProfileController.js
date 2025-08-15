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
            const newProfile = await codingProfileModel.findOneAndUpdate
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
                await codingProfileModel.findOneAndUpdate({ platform: profile.platform, userId: profile.userId }, { data, updatedAt: currentDateTime });
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
        const docCheck = await codingProfileModel.findOne({ platform });
        let doc = docCheck;
        if (!docCheck) {
            doc = await codingProfileModel.create({ platform, data: [], updatedAt: new Date() });
        }
        if (doc?.updatedAt && (new Date() - doc.updatedAt > 86400000 || !doc.data.length)) {
            const users = await user.find({}, { fullName: 1, admissionNumber: 1, [platform + 'Profile']: 1 });
            const profiles = [];
            await Promise.all(users.map(async (userDoc) => {
                try {

                    if (!userDoc[platform + 'Profile']) return;
                    const userId = userDoc[platform + "Profile"];
                    const response = await axios.get(`${CODING_PROFILE_API}/user/${platform}/${userId}`);
                    const data = response.data?.data || response.data;
                    profiles.push({
                        data,
                        userId,
                        _id: userDoc._id,
                        fullName: userDoc.fullName,
                        admissionNumber: userDoc.admissionNumber
                    });
                } catch (e) {
                    console.log(e);
                }
            }));
            doc.data = profiles;
            await doc.save();
            res.json(doc);
        } else {
            res.json(doc);
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to fetch user data" });
    }
};

const getContest = async (req, res) => {
    try {
        const response = await axios.get(`${CODING_PROFILE_API}/contests/upcoming`);
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error("Error fetching upcoming contests:", error.message);
        res.status(500).json({ success: false, error: "Failed to fetch contests" });
    }
}

const fetchCodingProfiles = async (req, res) => {
    try {
        const { platform, profileId } = req.query;
        const response = await axios.get(`${CODING_PROFILE_API}/user/${platform}/${profileId}`);
        const data = platform === 'leetcode' ? response?.data?.data : response?.data;

        if (!data) {
            return res.status(400).json({ error: "Coding Profile not found" });
        }

        let sortingKey = 0;
        switch (platform) {
            case 'codeforces':
                sortingKey = data[0]?.rating || 0;
                break;
            case 'codechef':
                sortingKey = data?.rating_number || 0;
                break;
            case 'leetcode':
                sortingKey = data?.userContestRanking?.rating || 0;
                break;
            default:
        }
        const codingProfile = await codingProfileModel.findOneAndUpdate(
            { platform, profileId },
            { data: data, sortingKey, updatedAt: new Date() },
            { new: true, upsert: true }
        );
        res.json(codingProfile);
    } catch (error) {
        console.error("Error fetching coding profiles:", error.message);
        res.status(500).json({ error: "Failed to fetch coding profiles" });
    }
}

const fetchAllCodingProfiles = async (req, res) => {
    try {
        const { platform } = req.query;
        const users = await user.find({}, { fullName: 1, admissionNumber: 1, [platform + 'Profile']: 1 });
        const profiles = [];
        await Promise.all(users.map(async (userDoc) => {
            try {
                if (!userDoc[platform + 'Profile']) return;
                const userId = userDoc[platform + "Profile"];
                const response = await axios.get(`${CODING_PROFILE_API}/user/${platform}/${userId}`);
                const data = platform === 'leetcode' ? response?.data?.data : response?.data;

                if (!data) return;
                let sortingKey = 0;
                switch (platform) {
                    case 'codeforces':
                        sortingKey = data[0]?.rating || 0;
                        break;
                    case 'codechef':
                        sortingKey = data?.rating_number || 0;
                        break;
                    case 'leetcode':
                        sortingKey = data?.userContestRanking?.rating || 0;
                        break;
                    default:
                }

                profiles.push({
                    data,
                    sortingKey,
                    profileId: userId,
                    userId: userDoc._id,
                    fullName: userDoc.fullName,
                    admissionNumber: userDoc.admissionNumber
                });
            } catch (e) {
                console.log(e);
            }
        }));
        if (profiles.length === 0) {
            return res.status(404).json({ error: "No coding profiles found" });
        }

        profiles.forEach(async (profile) => {
            try {
                await codingProfileModel.findOneAndUpdate(
                    { platform, profileId: profile.profileId },
                    {
                        data: profile.data,
                        sortingKey: profile.sortingKey,
                        userId: profile.userId,
                        fullName: profile.fullName,
                        admissionNo: profile.admissionNumber,
                        updatedAt: new Date()
                    },
                    { new: true, upsert: true }
                );
            } catch (error) {
                console.error("Error updating coding profile:", error.message);
            }
        });
        res.json({ success: true, message: `Total ${profiles.length} Coding profiles fetched and updated successfully` });
    } catch (error) {
        console.error("Error fetching coding profiles:", error.message);
        res.status(500).json({ success: false, error: "Failed to fetch coding profiles" });
    }
}

const getCodingProfiles = async (req, res) => {
    try {
        const platform = req.query.platform || "codeforces";
        const branch = req.query.branch || undefined;
        const year = req.query.year || undefined;
        const program = req.query.program || undefined;
        const status = req.query.status || undefined;
        const query = req.query.query || undefined;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || "sortingKey";
        const sortOrder = req.query.sortOrder || "desc";

        const filter = { platform };

        if (branch) filter.branch = branch;
        if (year) filter.year = year;
        if (program) filter.program = program;
        if (status) filter.status = status;
        if (query) filter.$or = [
            { fullName: new RegExp(query, 'i') },
            { admissionNo: new RegExp(query, 'i') }
        ];
        const skip = (page - 1) * limit;
        // get lean doc
        const codingProfiles = await codingProfileModel.find(filter)
            .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
            .select('-_id -__v')
            .skip(skip || 0)
            .limit(Number(limit) || 10)
            .exec();
        const totalProfiles = await codingProfileModel.countDocuments(filter);
        if (codingProfiles.length === 0) {
            return res.status(400).json({ success: false, message: "No coding profiles found" });
        }
        for(let i = 0; i < codingProfiles.length; i++) {
            codingProfiles[i] = codingProfiles[i].toObject();
            codingProfiles[i]['tableRank'] = skip + i + 1;
        }
        res.json({
            success: true,
            data: codingProfiles,
            totalProfiles,
            totalPages: Math.ceil(totalProfiles / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        console.error("Error fetching coding profiles:", error.message);
        res.status(500).json({ success: false, error: "Failed to fetch coding profiles" });
    }
};

const getCodingProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json({ success: false, error: "User ID is required" });
        }
        const codingProfile = await codingProfileModel.find({ userId });
        if (!codingProfile) {
            return res.status(400).json({ success: false, error: "Coding profile not found" });
        }
        const resData = {};
        codingProfile.forEach(profile => {
            resData[profile.platform] = profile;
        });
        res.json({ success: true, data: resData });
    }
    catch (error) {
        console.error("Error fetching coding profile:", error.message);
        res.status(500).json({ success: false, error: "Failed to fetch coding profile" });
    }
}

// sample request data for getCodingProfiles api:
// GET /api/coding-profiles?platform=codeforces&branch=CSE&year=2023&program=B.Tech&status=active&query=John&page=1&limit=10

module.exports = {
    getProfile,
    getProfiles,
    getPlatformProfile,
    getContest,
    getCodingProfiles,
    fetchCodingProfiles,
    fetchAllCodingProfiles,
    getCodingProfile
};