// models/Issue.js
const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Issue", issueSchema);
