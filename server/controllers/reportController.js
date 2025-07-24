const { sendEmail } = require('../utils/emailUtils');
const mongoose = require('mongoose');
let Report;
try {
  Report = require('../models/reportModel');
} catch (e) {
  // Define Report model if not present
  const reportSchema = new mongoose.Schema({
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { data: Buffer, contentType: String, filename: String },
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });
  Report = mongoose.model('Report', reportSchema);
}

// All reports are sent to the Nexus email address
const nexusEmail = "nexus@coed.svnit.ac.in";

exports.sendReport = async (req, res) => {
  try {
    const { category, description } = req.body;
    if (!category || !description) {
      return res.status(400).json({ error: 'Category and description are required.' });
    }
    let imageData = undefined;
    if (req.file) {
      imageData = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
    }
    // Save to DB first
    const reportDoc = new Report({
      category,
      description,
      image: imageData,
      user: req.user ? req.user._id : undefined
    });
    await reportDoc.save();

    // Always send to Nexus email
    let html = `<h3>New Report Submitted</h3><p><b>Category:</b> ${category}</p><p><b>Description:</b> ${description}</p>`;
    let attachments = [];
    if (req.file) {
      attachments.push({
        filename: req.file.originalname,
        content: req.file.buffer
      });
      html += `<p><b>Image attached.</b></p>`;
    }
    try {
      await sendEmail({
        to: nexusEmail,
        subject: `New Report: ${category}`,
        text: description,
        html,
        attachments
      });
    } catch (err) {
      // Log but do not fail the request if email fails
      console.error('Email send failed:', err);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process report.' });
  }
};

// Admin: Get paginated list of reports
exports.getReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [reports, total] = await Promise.all([
      Report.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Report.countDocuments()
    ]);
    res.json({
      reports,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reports.' });
  }
};