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
};

exports.createIssue = async (req, res) => {
  console.log(req.body)
  const { issueType, description } = req.body;

  try {
    // Save the issue to the database
    const newIssue = new Issue({ issueType, description });
    await newIssue.save();

    // Get roles based on the issue type
    const roles = issueTypeRoleMapping[issueType];
    if (!roles) {
      return res.status(400).json({ message: "Invalid issue type." });
    }

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
    }

    res.status(201).json({ message: "Issue created and team notified." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create issue." });
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
