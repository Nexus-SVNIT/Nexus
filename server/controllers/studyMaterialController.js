const mongoose = require('mongoose');
const Subject = require("../models/subjectModel");
const Resource = require("../models/resourceModel");


const getSubjects = async (req, res) => {
    try {
        const { category, department } = req.query;

        if (!category) {
            return res.status(400).json({ message: "A category is required" });
        }

        const filter = { category };

        // Only add department to filter if it's for Semester Exams
        if (category === "Semester Exams" && department) {
            filter.department = department;
        }

        const subjects = await Subject.find(filter).select('_id subjectName');
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
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid subject ID format" });
        }

        const subject = await Subject.findById(id)
            .select('subjectName tips resources')
            .populate({
                path: 'resources',
                select: 'title link subCategory resourceType' 
            });

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        res.status(200).json({
            message: "Subject details fetched successfully",
            data: subject
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching subject details" });
    }
};

module.exports = {
    getSubjects,
    getSubjectDetails
};