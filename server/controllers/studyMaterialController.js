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

        // trim whitespace from the input ---
        const category = rawCategory.trim();

        
        const filter = { 
            category: { $regex: new RegExp(`^${category}$`, 'i') } 
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
        // --- FIX: Added trim() to the id parameter ---
        const { id: rawId } = req.params;
        
        if (!rawId) {
             return res.status(400).json({ message: "Invalid subject ID format" });
        }
        const id = rawId.trim(); 
        // --- End Fix ---

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

        // Get all possible subCategories from your schema
        const allSubCategories = Resource.schema.path('subCategory').enumValues;

        // Create a base object with all categories as empty arrays
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
            // Sort tips by creation date and map to text
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

