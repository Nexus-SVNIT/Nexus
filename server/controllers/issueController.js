const Issue = require("../models/issueModel.js");
const { sendEmail } = require('../utils/emailUtils.js');
const User = require("../models/userModel.js");

exports.createIssue = async (req, res) => {
  const issueType = req.body.issueType;
  const description = req.body.description;
  const contactEmail = req.body.contactEmail;
  const contactName = req.body.contactName;

  // Check for authentication token
  let userDetails = null;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.SECRET || 'fallback_secret_key');

      if (decoded && decoded.admissionNumber) {
        userDetails = await User.findOne({ admissionNumber: decoded.admissionNumber });
      }
    } catch (error) {
    }
  } else {
  }

  try {
    // Validate required fields
    if (!issueType || !description) {
      return res.status(400).json({
        message: "Missing required fields",
        received: { issueType, description },
        bodyKeys: Object.keys(req.body),
        bodyValues: req.body
      });
    }

    let imageAttachment = null;
    if (req.file) {
      imageAttachment = {
        filename: req.file.originalname,
        content: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const issueData = {
      issueType,
      description,
      author: userDetails ? userDetails._id : null
    };

    const newIssue = new Issue(issueData);
    await newIssue.save();

    try {
      let userInfo;
      if (userDetails) {
        userInfo = `
          <li><strong>Reported by:</strong> ${userDetails.fullName || 'Unknown'}</li>
          <li><strong>Admission Number:</strong> ${userDetails.admissionNumber || 'Not provided'}</li>
          <li><strong>Email:</strong> ${userDetails.instituteEmail || userDetails.personalEmail || 'Not provided'}</li>
          <li><strong>Branch:</strong> ${userDetails.branch || 'Not provided'}</li>
        `;
      } else {
        userInfo = '<li><strong>Reported by:</strong> Anonymous user</li>';
        if (contactName || contactEmail) {
          userInfo += `
            <li><strong>Contact Name:</strong> ${contactName || 'Not provided'}</li>
            <li><strong>Contact Email:</strong> ${contactEmail || 'Not provided'}</li>
          `;
        }
      }

      const emailData = {
        to: 'Team Nexus <nexus@coed.svnit.ac.in>',
        subject: `New Issue Reported: ${issueType}`,
        text: `A new issue has been reported.\n\nIssue Type: ${issueType}\nDescription: ${description}${userDetails ? `\n\nReported by: ${userDetails.fullName} (${userDetails.admissionNumber})` : `\n\nReported by: Anonymous user${contactName || contactEmail ? `\nContact Name: ${contactName || 'Not provided'}\nContact Email: ${contactEmail || 'Not provided'}` : ''}`}`,
        html: `
          <p>A new issue has been reported in the system:</p>
          <ul>
            <li><strong>Issue Type:</strong> ${issueType}</li>
            <li><strong>Description:</strong> ${description}</li>
            ${userInfo}
          </ul>
          <p>Please review and address the issue as soon as possible.</p>
        `,
      };

      // Add image attachment if provided
      if (imageAttachment) {
        emailData.attachments = [imageAttachment];
      }

      await sendEmail(emailData);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({ message: "Issue created successfully." });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ message: "Failed to create issue.", error: error.message });
  }
};
