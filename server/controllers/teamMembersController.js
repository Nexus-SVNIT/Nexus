const teamMembersModel = require("../models/teamMembersModel");
const User = require("../models/userModel");

const getTeamMembersByYear = async (req, res) => {
    try {
        const { year } = req.params;

        // Find team members by year in the teamMembers collection
        const teamMembers = await teamMembersModel.find({ year });

        if (teamMembers.length === 0) {
            return res.status(200).json({ data: [], message: "No team members found for the given year" });
        }

        // Populate additional details from User collection for each team member
        const teamMembersWithDetails = await Promise.all(
            teamMembers.map(async (member) => {
                const userDetails = await User.findOne(
                    { admissionNumber: member.admissionNumber },
                    'fullName linkedInProfile githubProfile personalEmail' // Fetch only the necessary fields
                );

                return {
                    admissionNumber: member.admissionNumber,
                    role: member.role,
                    image: member.image,
                    year: member.year,
                    priority: member.priority,
                    fullName: userDetails?.fullName || null,
                    linkedInProfile: userDetails?.linkedInProfile || null,
                    githubProfile: userDetails?.githubProfile || null,
                    personalEmail: userDetails?.personalEmail || null
                };
            })
        );

        res.status(200).json({ data: teamMembersWithDetails });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving team members", error: error.message });
    }
};

const getUniqueYears = async (req, res) => {
    try {
        // Fetch unique years from the teamMembers collection
        const uniqueYears = (await teamMembersModel.distinct("year")).toSorted();
        if (!uniqueYears || uniqueYears.length === 0) {
            return res.status(200).json({ years: ['2025-2026'], message: "No years found" });
        }

        res.status(200).json({ years: uniqueYears });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving years", error: error.message });
    }
};

module.exports = { getTeamMembersByYear, getUniqueYears };
