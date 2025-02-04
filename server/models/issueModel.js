// models/Issue.js
const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
});

module.exports = mongoose.model("Issue", issueSchema);
