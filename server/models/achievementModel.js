const mongoose = require('mongoose')

const achievementSchema = new mongoose.Schema({
  email: {
    type: String, required: true
  },
  name: {
    type: String, required: true
  },
  achievement: {
    type: String, required: true
  },
  imageLink: {
    type: String, required: true
  },
  additionalLink: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

const Achievement = mongoose.model('Achievement', achievementSchema)

module.exports = Achievement
