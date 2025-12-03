const express=require('express');
const ResourceSchema=require('../models/resourceModel');
const Subject=require('../models/subjectSchema');
const resourceModel = require('../models/resourceModel');
const getSubjectsbyCategory = async (req, res) => {
    try {
        const { category } = req.params;
        if (!category) {
           
            return res.status(400).json({ message: "Please provide a category" });
        }

        
        const subjects = await Subject.find({ category: category });
        
     
        

        res.status(200).json(subjects.map(subject => subject.subjectName));

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Could not fetch subjects" });
    }
}

const getResourcesBySubjectandSubCategory = async (req, res) => {
    try {
        const { subjectName, subCategory } = req.params;
        if (!subjectName || !subCategory) {
            return res.status(400).json({ message: "Please provide both subject name and sub category" });
        }

    
        const subject = await Subject.findOne({ subjectName: subjectName })
            .populate({
                path: 'resources',
                match: { subCategory: subCategory },
                select: '-Link'
            });

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        const insights = subject.tips; 
        const resources = subject.resources;

        
        res.status(200).json({ insights, resources });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Could not fetch resources" });
    }
}
const addTips=async(req,res)=>{
    try{
        const { subjectName }=req.params;
        if(!subjectName){
            return res.status(400).json({ message: "Please provide subject name" });
        }
        const subject=await Subject.findOne({ subjectName: subjectName });
        if(!subject){
            return res.status(404).json({ message: "Subject not found" });
        }
        subject.tips=req.body.tips;
        await subject.save();
        res.status(200).json({ message: "Tips added successfully" });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Could not add tips" });
    }
}

const addResource = async (req, res) => {
    try {
        
        const { subjectName, subCategory, resourcetype, title, Link } = req.body;

        
        const subject = await Subject.findOne({ subjectName: subjectName });
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        
        const newResource = await resourceModel.create({
            title: title,
            subCategory: subCategory,
            resourcetype: resourcetype, 
            Link: Link
        });

        
        subject.resources.push(newResource._id);
        
       
        await subject.save();
        
        res.status(201).json({ message: "Resource added and linked successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding the resource" });
    }
}

module.exports={getSubjectsbyCategory,getResourcesBySubjectandSubCategory,addTips,addResource};

