const mongoose = require('mongoose');
const Subject = require("../models/subjectModel");
const Resource = require("../models/resourcesModel");

// Get subjects based on category and department
// Get ALL subjects — NO FILTERS
const getSubjects = async (req, res) => {
    try {
        

        const subjects = await Subject.find({}).select('_id subjectName');

        console.log("TOTAL SUBJECTS FOUND:", subjects.length);
        console.log("SAMPLE SUBJECT:", subjects[0] || "None");

        res.status(200).json({
            message: "ALL subjects fetched (no filters)",
            count: subjects.length,
            data: subjects
        });

    } catch (error) {
        console.error("ERROR in getSubjects:", error);
        res.status(500).json({ message: "Server error" });
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
