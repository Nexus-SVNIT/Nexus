const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const teamMembersModel = require("../models/teamMembersModel");
const User = require("../models/userModel");

// Google Drive setup with credentials
const credentials = {
    type: process.env.GOOGLE_CLOUD_TYPE,
    project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
    private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
    auth_uri: process.env.GOOGLE_CLOUD_AUTH_URI,
    token_uri: process.env.GOOGLE_CLOUD_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL,
    universe_domain: process.env.GOOGLE_CLOUD_UNIVERSE_DOMAIN
};

// Initialize Google Drive client
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive']
});
const drive = google.drive({ version: 'v3', auth });

// Helper function to upload image to Google Drive
const uploadImageToDrive = async (file, admissionNumber) => {
    try {
        if (!file) {
            return { success: false, error: 'No file uploaded.' };
        }

        const fileMetadata = {
            name: admissionNumber,
            parents: [process.env.GOOGLE_DRIVE_TEAM_MEMBERS_FOLDER_ID] // Folder for team members' images
        };

        const media = {
            mimeType: file.mimetype,
            body: fs.createReadStream(file.path),
        };

        const fileResponse = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        // Remove the local file after uploading to Google Drive
        fs.unlinkSync(file.path);

        return { success: true, fileId: fileResponse.data.id };
    } catch (error) {
        console.error('Error uploading file:', error.message || error);
        return { success: false, error: error.message || 'Unknown error' };
    }
};

// Controller to add a new team member
const addTeamMember = async (req, res) => {
    try {
        const { admissionNumber, role, year } = req.body;

        // Check if required fields are present
        if (!admissionNumber || !role || !year) {
            return res.status(400).json({ message: "Admission number, role, and year are required" });
        }

        // Check if user exists in User collection
        const userExists = await User.findOne({ admissionNumber });
        if (!userExists) {
            return res.status(404).json({ message: "User with this admission number does not exist" });
        }

        // Upload the team member's image to Google Drive
        const uploadResult = await uploadImageToDrive(req.file, admissionNumber);
        if (!uploadResult.success) {
            return res.status(500).json({ message: `Error uploading file: ${uploadResult.error}` });
        }

        // Create and save the new team member record
        const newTeamMember = new teamMembersModel({
            admissionNumber,
            role,
            image: uploadResult.fileId, // Save Google Drive file ID
            year
        });
        await newTeamMember.save();

        res.status(201).json({ message: "Team member added successfully", data: newTeamMember });
    } catch (error) {
        console.error('Error adding team member:', error.message);
        res.status(500).json({ message: "Error adding team member", error: error.message });
    }
};

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
      const uniqueYears = await teamMembersModel.distinct("year");
      if (!uniqueYears || uniqueYears.length === 0) {
        return res.status(200).json({ years: ['2024-2025'], message: "No years found" });
      }
  
      res.status(200).json({ years: uniqueYears });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving years", error: error.message });
    }
  };
  

module.exports = { addTeamMember, getTeamMembersByYear, getUniqueYears  };
