const fs = require('fs');
const { google } = require('googleapis');
const Achievement = require('../models/achievementModel');
const userSchema = require('../models/userModel');
const nodemailer = require('nodemailer');
const User = require('./models/User'); 

// Initialize Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

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

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

const allAchievements = async (req, res) => {
    try {
      // Fetch all verified achievements
      const achievements = await Achievement.find({ isVerified: true })
        .sort({ createdAt: 1 })
        .select('-isVerified');
        // Extract team member admission numbers from achievements
        const allTeamMembers = achievements.flatMap(achievement => achievement.teamMembers);
  
      // Fetch users corresponding to the team members
      const users = await userSchema.find({ admissionNumber: { $in: allTeamMembers } })
        .select('admissionNumber fullName linkedInProfile'); // Select only needed fields
  
      // Create a mapping of users by admissionNumber for easy lookup
      const userMap = users.reduce((acc, user) => {
        acc[user.admissionNumber] = user;
        return acc;
      }, {});
  
      // Combine achievements with user details
      const result = achievements.map(achievement => {
        const teamDetails = achievement.teamMembers.map(member => userMap[member] || null);
        return {
          ...achievement.toObject(), // Convert mongoose document to plain object
          teamMembersDetails: teamDetails // Add user details for team members
        };
      });
  
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to retrieve achievements' });
    }
  };
  
  


const pendingAchievements = async (req, res) => {
    const achievements = await Achievement.find({ isVerified: false }).sort({ createdAt: 1 }).select('-isVerified');
    return res.status(200).json(achievements);
};

// Function to upload image to Google Drive

const uploadImageToDrive = async (req) => {
    try {
        if (!req.file) {
            return { success: false, error: 'No file uploaded.' };
        }

        const fileMetadata = {
            name: req.file.originalname,
            parents: [process.env.GOOGLE_DRIVE_ACHIEVEMENTS_FOLDER_ID]
        };

        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(req.file.path),
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        fs.unlinkSync(req.file.path);

        return { success: true, fileId: file.data.id };
    } catch (error) {
        console.error('Error uploading file:', error.message || error);
        return { success: false, error: error.message || 'Unknown error' };
    }
};

const addAlumniDetails = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        // Upload the image to Google Drive
        const file = await uploadImageToDrive(req.file.path, req.file.originalname);

        if (!file) {
            return res.status(500).json({ message: "Failed to upload image" });
        }

        const alumniDetail = {
            ...req.body,
            ImageLink: `https://lh3.googleusercontent.com/d/${file.id}` // Store the Google Drive link in the database
        };

        await AlumniDetails.create(alumniDetail);

        // Fetch user details from the database
        const user = await User.findOne({ admissionNumber: req.user.admissionNumber });
        if (!user || !user.instituteEmail) {
            return res.status(400).json({ message: "User email not found" });
        }

        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Set up mail options
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: user.instituteEmail,
            subject: 'Alumni Details Submission Under Review',
            html: `
                <div style="background-color: black; color: white; font-size: 14px; padding: 20px;">
                    <div style="margin-bottom: 25px; display: flex; justify-content: center;">
                        <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="width: 350px;" />
                    </div>
                    <div>Dear ${user.fullName},</div>
                    <p>Thank you for taking the time to connect with us on the NEXUS Alumni portal.</p>
                    <p>Your details are currently under review, and once verified, they will be displayed on our Alumni Connect page.</p>
                    <p>We appreciate your support and look forward to showcasing your achievements to inspire our community.</p>
                    <p>Thanks,<br>Team NEXUS</p>
                </div>
            `
        };

        // Send mail
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Waiting for Review" });
    } catch (err) {
        console.error('Error adding alumni details:', err.message);
        return res.status(500).json({ message: "Error adding alumni details", error: err.message });
    }
};


const verifyAchievement = async (req, res) => {
    const achievementId = req.params.id;
    try {
        const updatedAchievement = await Achievement.findByIdAndUpdate(
            achievementId,
            { isVerified: true },
            { new: true, runValidators: true }
        );

        if (!updatedAchievement) {
            return res.status(404).json({ Message: "Achievement not found" });
        }

        return res.status(200).json({ Message: "Achievement verified successfully", achievement: updatedAchievement });
    } catch (err) {
        console.error('Error verifying achievement:', err.message);
        return res.status(500).json({ Message: "Error verifying achievement", error: err.message });
    }
};

const unverifyAchievement = async (req, res) => {
    const achievementId = req.params.id;
    try {
        const updatedAchievement = await Achievement.findByIdAndUpdate(
            achievementId,
            { isVerified: false },
            { new: true, runValidators: true }
        );

        if (!updatedAchievement) {
            return res.status(404).json({ Message: "Achievement not found" });
        }

        return res.status(200).json({ Message: "Achievement unverified successfully", achievement: updatedAchievement });
    } catch (err) {
        console.error('Error un-verifying achievement:', err.message);
        return res.status(500).json({ Message: "Error un-verifying achievement", error: err.message });
    }
};

module.exports = { allAchievements, addAchievement, pendingAchievements, verifyAchievement, unverifyAchievement };
