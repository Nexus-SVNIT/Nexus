const mongoose = require('mongoose');
const Subject = require("../models/subjectModel");
const Resource = require("../models/resourcesModel");

// Get subjects based on category and department
const getSubjects = async (req, res) => {
    try {
    
        // Get category/dept from query params
        const { category: rawCategory, department: rawDepartment } = req.query; // <-- Aliased department

       
        if (!rawCategory) {
            return res.status(400).json({ message: "Category is required" });
        }

        // Always trim whitespace from client input
        const category = rawCategory.trim();

        
        const filter = { 
            // Case-insensitive search, and loose regex to handle any whitespace in the DB
            category: { $regex: new RegExp(category, 'i') } 
        };
        
        // Standardize for logic checks
        const lowerCaseCategory = category.toLowerCase();


        // Semester exams require a specific department
        if (lowerCaseCategory === "semester exams") {
            if (!rawDepartment) { // <-- Check rawDepartment
                return res.status(400).json({ message: "Department is required for Semester Exams" });
            }
            
            // Trim dept input just in case
            filter.department = rawDepartment.trim();
        }

        // Placements all share the "Common" department
        if (lowerCaseCategory === "placements/internships") {
            filter.department = "Common"; 
        }
        
        console.log("FINAL QUERY FILTER:", JSON.stringify(filter)); // Debug log
        
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

// Get full subject details: tips + grouped resources
const getSubjectDetails = async (req, res) => {
    try {
        // Get id from URL params
        const { id: rawId } = req.params;
        
        if (!rawId) {
             return res.status(400).json({ message: "Invalid subject ID format" });
        }
        // Trim whitespace from URL param
        const id = rawId.trim(); 
        // --- End Fix ---

        // Check if it's a valid ObjectId *before* hitting the DB
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

        // Get all possible subCats from the schema to build a template
        const allSubCategories = Resource.schema.path('subCategory').enumValues;

        // Create a base object, so all subCats are present, even if empty
        const baseGroups = allSubCategories.reduce((acc, category) => {
            acc[category] = [];
            return acc;
        }, {});

        // Group the populated resources into the base object
        const groupedResources = subject.resources.reduce((acc, resource) => {
            // Check if subCategory exists in baseGroups to avoid errors
            if (acc[resource.subCategory]) {
                acc[resource.subCategory].push(resource);
            }
            return acc;
        }, baseGroups);
        
        const formattedSubject = {
            _id: subject._id,
            subjectName: subject.subjectName,
            // Sort tips oldest to newest before sending
            tips: subject.tips
                      .sort((a, b) => a.createdAt - b.createdAt)
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


module.exports = {
    getSubjects,
    getSubjectDetails
};


