const mongoose = require('mongoose');
const Subject = require("../models/subjectModel");
const Resource = require("../models/resourcesModel");

//get subjects based on category and departsment
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

        // placements all share the common department
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

// get full subject details
const getSubjectDetails = async (req, res) => {
    try {
        // get id from url params
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

        // get all possible subCats from the schema
        const allSubCategories = Resource.schema.path('subCategory').enumValues;

        // create a base object, so all subcats are present
        const baseGroups = allSubCategories.reduce((acc, category) => {
            acc[category] = [];
            return acc;
        }, {});


        const groupedResources = subject.resources.reduce((acc, resource) => {
            
            if (acc[resource.subCategory]) {
                acc[resource.subCategory].push(resource);
            }
            return acc;
        }, baseGroups);
        
        const formattedSubject = {
            _id: subject._id,
            subjectName: subject.subjectName,
            // sort tips oldest to newest before sending
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
};const express=require('express');
const { getSubjects,getSubjectDetails }=require('../controllers/studyMaterialController');
const router=express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/subjects', authMiddleware ,getSubjects);
router.get('/subjects/:id', authMiddleware , getSubjectDetails);


module.exports=router; 