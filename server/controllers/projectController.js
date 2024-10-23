// controllers/projectController.js
const Project = require('../models/projectModel');

// Get ongoing projects
const getOngoingProjects = async (req, res) => {
    try {
        const projects = await Project.find({ status: 'ongoing' });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new project
const createProject = async (req, res) => {
    const { title, description, githubLink, teamMembers } = req.body;

    const newProject = new Project({
        title,
        description,
        githubLink,
        status: 'ongoing', // Default status
        teamMembers,
    });

    try {
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getOngoingProjects,
    createProject,
};
