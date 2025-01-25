const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    answers: [{
      content: { type: String, required: true },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now },
    }],
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Question', QuestionSchema);