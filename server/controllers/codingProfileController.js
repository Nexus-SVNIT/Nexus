const axios = require("axios");
const codingProfileModel = require("../models/codingProfileModel");
const contestModel = require("../models/contestModel");

const CODING_PROFILE_API = process.env.CODING_PROFILE_BASE_URL;

const getContest = async (req, res) => {
    try {
        console.log("testing");
        const contests = await contestModel.findOne();
        if (contests && contests.updatedAt && (new Date() - contests.updatedAt) < 24 * 60 * 60 * 1000) {
            return res.json({ success: true, data: contests.data });
        }
        const response = await axios.get(`${CODING_PROFILE_API}/contests/upcoming`);

       

        await contestModel.findOneAndUpdate(
            {},
            { data: response.data, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error("Error fetching upcoming contests:", error.message);
        res.status(500).json({ success: false, error: "Failed to fetch contests" });
    }
}

const getCodingProfiles = async (req, res) => {
    try {
        const platform = req.query.platform || "codeforces";
        const branch = req.query.branch || undefined;
        const year = req.query.year || undefined;
        const program = req.query.program || undefined;
        const status = req.query.status || undefined;
        const query = req.query.search || undefined; // Changed from query to search to match frontend
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || "sortingKey";
        const sortOrder = req.query.sortOrder || "desc";

        const filter = { platform };

        if (branch) filter.branch = branch;
        if (year) filter.year = year;
        if (program) filter.program = program;
        if (status) filter.status = status;
        if (query) {
            // Create a case-insensitive search query and escape special characters
            const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.$or = [
                { fullName: new RegExp(sanitizedQuery, 'i') },
                { admissionNo: new RegExp(sanitizedQuery, 'i') },
            ];
        }
        const skip = (page - 1) * limit;
        // get lean doc
        const codingProfiles = await codingProfileModel.find(filter)
            .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
            .select('-_id -__v')
            .skip(skip || 0)
            .limit(Number(limit) || 10)
            .exec();
        const totalProfiles = await codingProfileModel.countDocuments(filter);
        
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

module.exports = {
    getContest,
    getCodingProfiles,
    getCodingProfile
};