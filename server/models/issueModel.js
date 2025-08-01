// models/Issue.js
const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: { type: Buffer }, // For storing image data if uploaded
});

module.exports = mongoose.model("Issue", issueSchema);
