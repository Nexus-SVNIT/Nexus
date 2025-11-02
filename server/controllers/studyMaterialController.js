const mongoose = require('mongoose');
const Subject = require("../models/subjectModel");
const Resource = require("../models/resourcesModel");

//get subjects based on category and department
const getSubjects = async (req, res) => {
    try {
    
        // get category/dept from query params
        const { category: rawCategory, department: rawDepartment } = req.query; // <-- Aliased department

       
        if (!rawCategory) {
            return res.status(400).json({ message: "Category is required" });
        }

        // always trim whitespace from client input
        const category = rawCategory.trim();

        
        const filter = { 
            // case-insensitive search, and loose regex to handle any whitespace in the DB
            category: { $regex: new RegExp(category, 'i') } 
        };
        
        // standardize for logic checks
        const lowerCaseCategory = category.toLowerCase();


        // semester exams require a specific department
        if (lowerCaseCategory === "semester exams") {
            if (!rawDepartment) { 
                return res.status(400).json({ message: "Department is required for Semester Exams" });
            }
            
         
            filter.department = rawDepartment.trim();
        }

        // placements all share the Common department
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

// Get full subject details
const getSubjectDetails = async (req, res) => {
    try {
        // Get id from url params
        const { id: rawId } = req.params;
        
        if (!rawId) {
             return res.status(400).json({ message: "Invalid subject ID format" });
        }
        
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


