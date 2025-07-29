const Issue = require("../models/issueModel.js");
const teamMembersModel = require("../models/teamMembersModel");
const { sendEmail } = require('../utils/emailUtils.js');

// Map issue types to roles that should handle them
const issueTypeRoleMapping = {
  "Website Issue": ["Developer"],
  "AI/ML Issue": ["AI/ML Head"],
  "Finance Issue": ["Treasurer"],
  "Design Issue": ["Design Head"],
  "Media Issue": ["Media Head"],
  "Alumni Issue": ["Alma Relation Head"],
  "Other": ["Developer"],
  // Frontend categories
  "Website or Tech issue/bug": ["Developer"],
  "Nexus's operation related issue": ["Developer"],
  "Event related issue": ["Developer"],
  "Finance related issue": ["Treasurer"],
  "Nexus's Social Media related issue": ["Media Head"],
  "Feedback": ["Developer"]
};

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

    // Get roles based on the issue type
    const roles = issueTypeRoleMapping[issueType];
    if (!roles) {
      console.log('Invalid issue type:', issueType);
      return res.status(400).json({ message: "Invalid issue type." });
    }

    // Try to send emails, but don't fail if email sending fails
    try {
      // Find team members with the required roles
      const teamMembers = await teamMembersModel.find({ role: { $in: roles } });

      if (teamMembers.length > 0) {
        // Collect email addresses of relevant team members
        const emailRecipients = teamMembers.map(member => member.email);

        // Send notification emails to each relevant team member
        await Promise.all(
          emailRecipients.map((to) =>
            sendEmail({
              to,
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
            })
          )
        );
        console.log('Emails sent successfully');
      } else {
        console.log('No team members found for roles:', roles);
      }
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
