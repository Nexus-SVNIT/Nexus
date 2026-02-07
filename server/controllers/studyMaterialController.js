const mongoose = require('mongoose');
const Subject = require("../models/subjectModel");
const Resource = require("../models/resourcesModel");



const getSubjects = async (req, res) => {
    try {
        
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

        const { category: rawCategory, department: rawDepartment } = req.query;

        if (!rawCategory) {
            return res.status(400).json({ message: "Category is required" });
        }

        const category = rawCategory.trim();
        const filter = {};

       
        filter.category = category; 

        if (category.toLowerCase() === "semester exams") {
            if (!rawDepartment) {
                return res.status(400).json({ message: "Department is required" });
            }
            filter.department = rawDepartment.trim();
        }

        if (category.toLowerCase() === "placements/internships") {
            filter.department = "Common";
        }

      
        const subjects = await Subject.find(filter).select('_id subjectName').lean();

        res.status(200).json({
            message: "Subjects fetched successfully",
            data: subjects
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching subjects" });
    }
};

const getSubjectDetails = async (req, res) => {
    try {
        
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

        const { id: rawId } = req.params;
        if (!rawId || !mongoose.Types.ObjectId.isValid(rawId)) {
             return res.status(400).json({ message: "Invalid ID" });
        }

        const id = rawId.trim();

        
        const [subject, resources] = await Promise.all([
            Subject.findById(id).select('subjectName tips').lean(),
            Resource.find({ subject: id }).select('title link subCategory resourceType').lean()
        ]);

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

       
        
        res.status(200).json({
            message: "Subject details fetched successfully",
            data: {
                _id: subject._id,
                subjectName: subject.subjectName,
                tips: subject.tips.sort((a, b) => a.createdAt - b.createdAt).map(t => t.text),
                resources: resources 
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching details" });
    }
};

module.exports = {
    getSubjects,
    getSubjectDetails
};