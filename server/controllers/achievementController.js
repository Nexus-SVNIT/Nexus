const fs = require('fs');
const { google } = require('googleapis');
const Achievement = require('../models/achievementModel');
const { error } = require('console');
const allAchievements = async (req, res) => {
  const achievements = await Achievement.find({ isVerified: true }).sort({ createdAt: 1 }).select('-isVerified');
  return res.status(200).json(achievements)
}
const addAchievement = async (req, res) => {

  const credentials = {
    type: process.env.GOOGLE_CLOUD_TYPE,
    project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
    private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
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
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  const drive = google.drive({ version: 'v3', auth });

  const folderId = "1qT63Rg5g7TIdAfnjqDOKSsh1N6UIpzdd";


  const requestBody = {
    name: `${req.members}_${Date.now()}`,
    parents: [folderId],
    fields: 'id',
  };

  try {
    const media = {
      mimeType: 'image/jpeg',
      body: req.image,
    };

    const file = await drive.files.create({
      requestBody,
      media,
    });
    const achievement = {
      email: req.body.email,
      name: req.body.members,
      achievement: req.body.desc,
      imageLink: file?.data?.id,
      additionalLink: req.body.proof,
    }
    await Achievement.create(achievement);


    return res.status(200).json({ Message: "Waiting for Review" });
  } catch (err) {
    console.error('Error uploading file:', err.message);
    return res.status(500).json(err);
  }
}

module.exports = { allAchievements, addAchievement }

// Call the function to upload the file to the "nexus" folder

