const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  admissionNumber: { type: String, required: true },
  teamMembers: { type: [String], required: true },
  desc: { type: String, required: true },
  proof: { type: String, required: true },
  image: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
}, { 
  timestamps: true,
  strictPopulate: false // Set this to false if needed
});


const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;
