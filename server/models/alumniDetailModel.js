const mongoose = require('mongoose')

const AlumniDetailsSchema = new mongoose.Schema({

  'ImageLink': {
    type: String,
  },
  
  'Name': {
    type: String, required: true
  },
  'E-Mail': {
    type: String, required: true
  },
  'Expertise': {
    type: String
  },
 
  'Admission No': {
    type: String,required: true
  },
  'Current Role': {
    type: String,required: true
  },
  'Company Name': {
    type: String,required: true
  },
  'Mobile Number': {
    type: String, required: true
  },
  'Passing Year': {
    type: String, required: true
  },
  'LinkedIn': {
    type: String, required: true
  },
  'codeforcesId': {
    type: String
  },
  'LeetcodeId': {
    type: String
  },
  'shareCodingProfile':{
    type: Boolean,
    default: false
  },
  
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

const AlumniDetails = mongoose.model('AlumniDetails', AlumniDetailsSchema)

module.exports = AlumniDetails
