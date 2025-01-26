const mongoose = require('mongoose');

function arrayLimit(val) {
  return val.length >= 1;
}

const Schema = mongoose.Schema;
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  company: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
  campusType: {
    type: String,
    enum: ['In Campus', 'Off Campus', 'Pool Campus'],
    required: true
  },
  jobType: {
    type: String,
    enum: ['2 Month Internship', '6 Month Internship', 'Full Time', '6 Month Internship + Full Time'],
    required: true
  },
  selectionProcess: {
    onlineAssessment: {
      aptitude: Boolean,
      coreSubject: Boolean,
      codingRound: Boolean,
      english: Boolean,
      communication: Boolean
    },
    groupDiscussion: Boolean,
    onlineInterview: Boolean,
    offlineInterview: Boolean,
    others: [String]
  },
  rounds: {
    technical: Number,
    hr: Number,
    hybrid: Number
  },
  compensation: {
    stipend: Number,
    ctc: Number,
    baseSalary: Number
  },
  difficultyLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  hiringPeriod: {
    month: Number,
    year: Number
  },
  cgpaCriteria: {
    boys: { type: Number, min: 0, max: 10 },
    girls: { type: Number, min: 0, max: 10 }
  },
  shortlistCriteria: {
    boys: { type: Number, min: 0, max: 10 },
    girls: { type: Number, min: 0, max: 10 }
  },
  shortlistedCount: {
    boys: { type: Number, min: 0 },
    girls: { type: Number, min: 0 }
  },
  selectedCount: {
    boys: { type: Number, min: 0 },
    girls: { type: Number, min: 0 }
  },
  workMode: {
    type: String,
    enum: ['Remote', 'On-site', 'Hybrid'],
    required: true
  },
  location: {
    type: [String], // Changed to array of strings
    required: true,
    validate: [arrayLimit, 'Must have at least one location']
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Post', PostSchema);
