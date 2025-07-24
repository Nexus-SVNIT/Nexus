const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String, required: true },
  image: { data: Buffer, contentType: String, filename: String },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Report', reportSchema); 