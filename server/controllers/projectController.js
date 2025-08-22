const Project = require('../models/projectModel');
const User = require('../models/userModel'); // Import User model

// Get ongoing projects
const getOngoingProjects = async (req, res) => {
    try {
        // Fetch all ongoing projects
        const projects = await Project.find({ status: 'ongoing' });

        // Populate name and LinkedIn for team members and mentors
        const populatedProjects = await Promise.all(
            projects.map(async (project) => {
                const teamMembers = await Promise.all(
                    project.teamMembers.map(async (member) => {
                        const user = await User.findOne({ admissionNumber: member.admissionNumber });
                        return {
                            admissionNumber: member.admissionNumber,
                            name: user ? user.fullName : 'N/A',
                            linkedin: user ? user.linkedInProfile : null,
                        };
                    })
                );

                const mentors = await Promise.all(
                    project.mentors.map(async (mentor) => {
                        const user = await User.findOne({ admissionNumber: mentor.admissionNumber });
                        return {
                            admissionNumber: mentor.admissionNumber,
                            name: user ? user.fullName : 'N/A',
                            linkedin: user ? user.linkedInProfile : null,
                        };
                    })
                );

                return { ...project.toObject(), teamMembers, mentors };
            })
        );
        res.json(populatedProjects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getOngoingProjects,
};
