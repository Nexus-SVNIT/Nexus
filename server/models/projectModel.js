// models/Project.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    githubLink: String,
    status: { type: String, default: 'ongoing' },
    teamMembers: [{ admissionNumber: String }],
    mentors: [{ admissionNumber: String }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', ProjectSchema);
