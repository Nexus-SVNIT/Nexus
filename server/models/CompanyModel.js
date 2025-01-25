


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CompanySchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  });
  
  module.exports = mongoose.model('Company', CompanySchema);