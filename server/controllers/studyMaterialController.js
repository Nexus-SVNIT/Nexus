const mongoose = require('mongoose');
const Subject = require("../models/subjectModel");
const Resource = require("../models/resourcesModel");

// 1. Get subjects based on category and department
const getSubjects = async (req, res) => {
    try {
        const { category: rawCategory, department: rawDepartment } = req.query;

        if (!rawCategory) {
            return res.status(400).json({ message: "Category is required" });
        }

        const category = rawCategory.trim();
        const filter = { category }; 

        if (category === "Semester Exams") {
            if (!rawDepartment) {
                return res.status(400).json({ message: "Department is required for Semester Exams" });
            }
            filter.department = rawDepartment.trim();
        }

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

    } catch (error) {
        console.error("Error in getSubjects:", error); // Improved logging
        return res.status(500).json({ message: "Error fetching subjects" });
    }
};

// 2. Get full subject details
const getSubjectDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid subject ID format" });
        }
        
        res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=86400");

        const subject = await Subject.findById(id)
            .select("subjectName tips resources")
            .lean();

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // SAFETY FIX 1: Default to empty array if resources field is missing
        const resourceIds = subject.resources || [];

        const resources = await Resource.find({
            _id: { $in: resourceIds }
        })
        .select("title link subCategory resourceType")
        .lean();

        // Initialize groups based on Enum
        const subCats = Resource.schema.path("subCategory").enumValues;
        const grouped = {};
        subCats.forEach(cat => (grouped[cat] = []));

        // SAFETY FIX 2: Prevent crash if resource has a subCategory not in the list
        resources.forEach(r => {
            if (grouped[r.subCategory]) {
                grouped[r.subCategory].push(r);
            } else {
                // Optional: Push to an 'Other' array or simply ignore
                if (!grouped['Other']) grouped['Other'] = [];
                grouped['Other'].push(r);
            }
        });

        // SAFETY FIX 3: Ensure dates are parsed correctly before subtracting
        const sortedTips = (subject.tips || [])
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) 
            .map(t => t.text);

        return res.status(200).json({
            message: "Subject details fetched successfully",
            data: {
                _id: subject._id,
                subjectName: subject.subjectName,
                tips: sortedTips, 
                resources: grouped
            }
        });

    } catch (error) {
        console.error("Error in getSubjectDetails:", error);
        return res.status(500).json({ message: "Error fetching subject details" });
    }
};

// 3. Get all subjects 
const getAllSubjects = async (req, res) => {
    try {
        // EDGE CACHE – 1 hour
        res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");

        const subjects = await Subject.find({})
            .select("_id subjectName category department")
            .lean();

        return res.status(200).json({
            message: "All subjects fetched successfully",
            data: subjects
        });

    } catch (error) {
        console.error("Error in getAllSubjects:", error);
        return res.status(500).json({ message: "Error fetching all subjects" });
    }
};

module.exports = {
    getSubjects,
    getSubjectDetails,
    getAllSubjects
};