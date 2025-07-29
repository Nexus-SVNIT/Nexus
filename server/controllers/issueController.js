const Issue = require("../models/issueModel.js");
const { sendEmail } = require('../utils/emailUtils.js');

exports.createIssue = async (req, res) => {
  const issueType = req.body.issueType;
  const description = req.body.description;
  
  console.log('Extracted values:', { issueType, description });

  try {
    // Validate required fields
    if (!issueType || !description) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ 
        message: "Missing required fields", 
        received: { issueType, description },
        bodyKeys: Object.keys(req.body),
        bodyValues: req.body
      });
    }

    // Save the issue to the database
    console.log('Creating new issue...');
    const newIssue = new Issue({ issueType, description });
    console.log('Issue object created:', newIssue);
    
    await newIssue.save();
    console.log('Issue saved to database');

    // Send email notification to nexus@coed.svnit.ac.in
    try {
      await sendEmail({
        to: 'nexus@coed.svnit.ac.in',
        subject: `New Issue Reported: ${issueType}`,
        text: `A new issue has been reported.\n\nIssue Type: ${issueType}\nDescription: ${description}`,
        html: `
          <p>A new issue has been reported in the system:</p>
          <ul>
            <li><strong>Issue Type:</strong> ${issueType}</li>
            <li><strong>Description:</strong> ${description}</li>
          </ul>
          <p>Please review and address the issue as soon as possible.</p>
        `,
      });
      console.log('Email sent successfully to nexus@coed.svnit.ac.in');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue with the response even if email fails
    }

    console.log('Sending success response with status 201');
    res.status(201).json({ message: "Issue created successfully." });
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: "Failed to create issue.", error: error.message });
  }
};

// Admin: Get paginated list of issues
exports.getIssues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [issues, total] = await Promise.all([
      Issue.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Issue.countDocuments()
    ]);
    res.json({
      issues,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch issues.' });
  }
};
