const { sendEmail } = require('../utils/emailUtils');

// Map categories to email addresses
const categoryEmailMap = {
  "Website or Tech issue/bug": "guptajeet2506@gmail.com",
  "Nexus's operation related issue": "guptajeet2506@gmail.com",
  "Event related issue": "guptajeet2506@gmail.com",
  "Finance related issue": "guptajeet2506@gmail.com",
  "Nexus's Social Media related issue": "guptajeet2506@gmail.com",
  "Other": "nexus@coed.svnit.ac.in",
  "Feedback": "nexus@coed.svnit.ac.in"
};

exports.sendReport = async (req, res) => {
  try {
    const { category, description } = req.body;
    if (!category || !description) {
      return res.status(400).json({ error: 'Category and description are required.' });
    }
    const to = categoryEmailMap[category] || categoryEmailMap['Other'];
    let html = `<h3>New Report Submitted</h3><p><b>Category:</b> ${category}</p><p><b>Description:</b> ${description}</p>`;
    let attachments = [];
    if (req.file) {
      attachments.push({
        filename: req.file.originalname,
        content: req.file.buffer
      });
      html += `<p><b>Image attached.</b></p>`;
    }
    await sendEmail({
      to,
      subject: `New Report: ${category}`,
      text: description,
      html,
      attachments
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send report.' });
  }
}; 