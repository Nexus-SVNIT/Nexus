const mongoose = require('mongoose');
const Subject = require("../models/subjectModel");
const Resource = require("../models/resourcesModel");

// Get subjects based on category and department
const getSubjects = async (req, res) => {
    try {
        const { category: rawCategory, department } = req.query;

        if (!rawCategory) {
            return res.status(400).json({ message: "Category is required" });
        }

        // --- CRITICAL: Decode URL-encoded characters (e.g. %2F → /) ---
        const category = decodeURIComponent(rawCategory).trim();

        // --- Escape regex special characters ---
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // --- DEBUG: See exactly what's happening ---
        console.log("=== GET SUBJECTS DEBUG ===");
        console.log("Raw (encoded):", rawCategory);
        console.log("Decoded category:", category);
        console.log("Escaped regex:", escapeRegex(category));
        console.log("Final RegExp:", new RegExp(escapeRegex(category), 'i').toString());

        const filter = { 
            category: { $regex: new RegExp(escapeRegex(category), 'i') } 
        };
        
        const lowerCaseCategory = category.toLowerCase();

        if (lowerCaseCategory === "semester exams") {
            if (!department) {
                return res.status(400).json({ message: "Department is required for Semester Exams" });
            }
            filter.department = department.trim();
        }

        if (lowerCaseCategory === "placements/internships") {
            filter.department = "Common"; 
        }

        console.log("FINAL QUERY FILTER (for MongoDB):", filter);
        console.log("===========================\n");

        const subjects = await Subject.find(filter).select('_id subjectName');
        
        res.status(200).json({
            컨message: "Subjects fetched successfully",
            data: subjects
        });

    } catch (error) {
        console.error("ERROR in getSubjects:", error);
        res.status(500).json({ message: "Error fetching subjects" });
    }
};

// Get full subject details: tips + grouped resources
const getSubjectDetails = async (req, res) => {
    try {
        const { id: rawId } = req.params;
        if (!rawId) return res.status(400).json({ message: "Invalid subject ID format" });
        const id = rawId.trim();

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

        // SAFE: Get enum values
        const subCategoryPath = Resource.schema.path('subCategory');
        const allSubCategories = subCategoryPath?.enumValues || [];

        const baseGroups = allSubCategories.reduce((acc, cat) => {
            acc[cat] = [];
            return acc;
        }, {});

        // SAFE: Handle resources array
        const resources = Array.isArray(subject.resources) ? subject.resources : [];
        const groupedResources = resources.reduce((acc, resource) => {
            const subCat = resource?.subCategory;
            if (subCat && acc.hasOwnProperty(subCat)) {
                acc[subCat].push(resource);
            }
            return acc;
        }, { ...baseGroups });

        const formattedSubject = {
            _id: subject._id,
            subjectName: subject.subjectName,
            tips: (subject.tips || [])
                .filter(tip => tip?.createdAt)
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
                .map(t => t.text),
            resources: groupedResources 
        };

        res.status(200).json({
            message: "Subject details fetched successfully",
            data: formattedSubject
        });

    } catch (error) {
        console.error("ERROR in getSubjectDetails:", error);
        res.status(500).json({ message: "Error fetching subject details" });
    }
};

module.exports = { getSubjects, getSubjectDetails };
