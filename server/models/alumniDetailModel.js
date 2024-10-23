const mongoose = require('mongoose')

const AlumniDetailsSchema = new mongoose.Schema({
  'ImageLink': {
    type: String, required: true
  },
  Name: {
    type: String, required: true
  },
  'E-Mail': {
    type: String, required: true
  },
  Expertise: {
    type: String
  },
  'Admission No': {
    type: String
  },
  'Current Role': {
    type: String
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
  isVerified: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

const AlumniDetails = mongoose.model('AlumniDetails', AlumniDetailsSchema)

module.exports = AlumniDetails
