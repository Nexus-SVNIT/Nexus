const mongoose = require('mongoose');
const Subject = require("../models/subjectModel");
const Resource = require("../models/resourcesModel");

const getSubjects = async (req, res) => {
    try {
        const { category: rawCategory, department } = req.query;

        if (!rawCategory) {
            return res.status(400).json({ message: "Category is required" });
        }

        const category = rawCategory.trim();
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

        console.log("FINAL QUERY FILTER:", JSON.stringify(filter));
        
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

        // SAFE: enumValues
        const subCategoryPath = Resource.schema.path('subCategory');
        const allSubCategories = subCategoryPath?.enumValues || [];

        const baseGroups = allSubCategories.reduce((acc, cat) => {
            acc[cat] = [];
            return acc;
        }, {});

        // SAFE: resources reduce
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
        console.error(error);
        res.status(500).json({ message: "Error fetching subject details" });
    }
};

module.exports = { getSubjects, getSubjectDetails };
