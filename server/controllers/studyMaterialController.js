// controllers/studyMaterialController.js
const mongoose = require('mongoose');
const Subject = require('../models/subjectModel');
const Resource = require('../models/resourcesModel');


const listSubjects = async (req, res) => {
    try {
        const { category: rawCategory, department: rawDepartment } = req.query;

        if (!rawCategory)
            return res.status(400).json({ message: "Category is required" });

        const category = rawCategory.trim();
        const filter = { category };

        // Semester exam route -> needs department
        if (category === "Semester Exams") {
            if (!rawDepartment)
                return res.status(400).json({ message: "Department is required for Semester Exams" });

            const dep = rawDepartment.trim();
            if (!['CSE', 'AI', 'Common'].includes(dep))
                return res.status(400).json({ message: "Invalid department" });

            filter.department = dep;
        }

        // Placements -> always Common
        if (category === "Placements/Internships") {
            filter.department = "Common";
        }

        res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=86400");

        const subjects = await Subject.find(filter)
            .select("_id subjectName")
            .lean();

        return res.status(200).json({
            message: "Subjects fetched successfully",
            data: subjects
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};



const listAllSubjects = async (req, res) => {
    try {
        res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");

        const subjects = await Subject.find({})
            .select("_id subjectName category department")
            .lean();

        return res.status(200).json({
            message: "All subjects fetched successfully",
            data: subjects
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


const getSubject = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: "Invalid subject ID" });

        res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=86400");

        const subject = await Subject.findById(id)
            .select("subjectName tips resources")
            .lean();

        if (!subject)
            return res.status(404).json({ message: "Subject not found" });

        const resources = await Resource.find({
            _id: { $in: subject.resources }
        })
            .select("title link subCategory resourceType")
            .lean();

        // Grouping logic
        const subCats = Resource.schema.path("subCategory").enumValues;
        const grouped = {};
        subCats.forEach(cat => grouped[cat] = []);

        resources.forEach(r => {
            if (!grouped[r.subCategory])
                grouped[r.subCategory] = [];
            grouped[r.subCategory].push(r);
        });

        // Optional improvement: sort resources alphabetically
        Object.keys(grouped).forEach(cat => {
            grouped[cat].sort((a, b) => a.title.localeCompare(b.title));
        });

        return res.status(200).json({
            message: "Subject details fetched",
            data: {
                _id: subject._id,
                subjectName: subject.subjectName,
                tips: (subject.tips || [])
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                    .map(t => t.text),
                resources: grouped
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

module.exports = {
    listSubjects,
    listAllSubjects,
    getSubject
};
