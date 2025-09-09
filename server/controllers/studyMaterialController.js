const mongoose = require('mongoose');
const Subject = require("../models/subjectModel");
const Resource = require("../models/resourceModel");

// Get subjects list based on category (and department if Semester Exams)
const getSubjects = async (req, res) => {
    try {
        const { category, department } = req.query;

        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        const filter = { category };

        if (category === "Semester Exams") {
            if (!department) {
                return res.status(400).json({ message: "Department is required for Semester Exams" });
            }
            filter.department = department;
        }

        if (category === "Placements/Internships") {
            filter.department = "Common"; 
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

// Get full subject details: tips + resources
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

        
        const formattedSubject = {
            _id: subject._id,
            subjectName: subject.subjectName,
            tips: subject.tips.map(t => t.text),
            resources: subject.resources
        };

        res.status(200).json({
            message: "Subject details fetched successfully",
            data: formattedSubject
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

