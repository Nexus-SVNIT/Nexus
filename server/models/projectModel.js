// models/Project.js
const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
});

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    githubLink: { type: String, required: true }, // Add GitHub link
    
    status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
    teamMembers: [TeamMemberSchema], // Array of team members
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', ProjectSchema);
