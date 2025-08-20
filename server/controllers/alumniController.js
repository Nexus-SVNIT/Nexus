const User = require('../models/userModel');

const getAllAlumniDetails = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Filters
        const { batchFrom, batchTo, company, expertise, q } = req.query;
        const query = { isAlumni: true, isVerified: true };

        // Batch (passingYear) range filter
        if (batchFrom || batchTo) {
            query.passingYear = {};
            if (batchFrom) query.passingYear.$gte = Number(batchFrom);
            if (batchTo) query.passingYear.$lte = Number(batchTo);
        }

        if (company) {
            query.currentCompany = { $regex: company, $options: 'i' };
        }

        if (expertise) {
            query.expertise = { $regex: expertise, $options: 'i' };
        }

        // Common search query (name, admission no, company, expertise)
        if (q) {
            query.$or = [
                { fullName: { $regex: q, $options: 'i' } },
                { admissionNumber: { $regex: q, $options: 'i' } },
                { currentCompany: { $regex: q, $options: 'i' } },
                { expertise: { $regex: q, $options: 'i' } }
            ];
        }

        const total = await User.countDocuments(query);
        const alumniDetails = await User.find(query)
            .sort({ _id: 1 })
            .select('fullName passingYear currentDesignation currentCompany expertise linkedInProfile location')
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            data: alumniDetails,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching all alumni:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getAllCompaniesAndExpertise = async (req, res) => {
    try {


        // run both parallel
        const [companies, expertise] = await Promise.all([
            User.distinct('currentCompany', {
                isAlumni: true,
                isVerified: true,
                currentCompany: { $nin: [null, ''] }
            }),
            User.distinct('expertise', {
                isAlumni: true,
                isVerified: true,
                expertise: { $nin: [null, ''] }
            })
        ]);

        return res.status(200).json({ companies, expertise });
    } catch (error) {
        console.error("Error fetching companies:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getAllAlumniDetails,
    getAllCompaniesAndExpertise
};