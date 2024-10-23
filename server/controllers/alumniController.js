const fs = require('fs');
const AlumniDetails = require('../models/alumniDetailModel');
const { log } = require('console');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dbhf7xh4q',
    api_key: '887173712287675',
    api_secret: process.env.CLOUDINARY_SECRET
});

const uploadImage = async (image) => {

  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,

  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(image, options);

    return result;
  } catch (error) {
    return null;
    console.error("ERR", error);
  }
};
const allAlumniDetails = async (req, res) => {
  const alumniDetails = await AlumniDetails.find({}).sort({ createdAt: 1 }).select('-isVerified');
  return res.status(200).json(alumniDetails)

}
const allVerifiedAlumniDetails = async (req, res) => {
  const alumniDetails = await AlumniDetails.find({ isVerified: true }).sort({ createdAt: 1 }).select('-isVerified');
  return res.status(200).json(alumniDetails)

}
const addAlumniDetails = async (req, res) => {

  try {
    const file = await uploadImage(req.body.ImageLink);
    const alumniDetail = {
      ...req.body,
      ImageLink: file.secure_url,

    }
    await AlumniDetails.create(alumniDetail);
    return res.status(200).json({ Message: "Waiting for Review" });
  } catch (err) {
    console.error('Error uploading file:', err.message);
    return res.status(500).json(err);
  }
}

module.exports = { allAlumniDetails, addAlumniDetails, allVerifiedAlumniDetails }

// Call the function to upload the file to the "nexus" folder

