const mongoose = require('mongoose');
const Subject = require("../models/subjectModel");
const Resource = require("../models/resourcesModel");

//get subjects based on category and department
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
        console.error(error);
        return res.status(500).json({ message: "Error fetching subjects" });
    }
};

// get full subject details
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

        // fetch resources in a single query
        const resources = await Resource.find({
            _id: { $in: subject.resources }
        })
        .select("title link subCategory resourceType")
        .lean();

        // group resources
        const subCats = Resource.schema.path("subCategory").enumValues;
        const grouped = {};

        subCats.forEach(cat => (grouped[cat] = []));
        resources.forEach(r => grouped[r.subCategory].push(r));

        return res.status(200).json({
            message: "Subject details fetched successfully",
            data: {
                _id: subject._id,
                subjectName: subject.subjectName,
                tips: subject.tips
                    .sort((a, b) => a.createdAt - b.createdAt)
                    .map(t => t.text),
                resources: grouped
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching subject details" });
    }
};

// get all subjects 
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
        console.error(error);
        return res.status(500).json({ message: "Error fetching all subjects" });
    }
};




module.exports = {
    getSubjects,
    getSubjectDetails,
    getAllSubjects
};