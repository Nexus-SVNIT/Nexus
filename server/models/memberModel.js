const mongoose = require('mongoose')

const MemberInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  admNo: {
    type: String,
    default: 'U2XCSXXX',
    required: true
  },
  socialLinks: {
    facebookLink: {
      type: String,
      required: true
    },
    linkedinLink: {
      type: String,
      required: true
    },
    instagramLink: {
      type: String,
      required: true
    }
<<<<<<< HEAD
  }
=======
});
>>>>>>> 374e3e4fc1f6d09a9f6bffd289def1ee59240d7f

})

const MemberDetailsModel = mongoose.model('MemberDetail', MemberInfoSchema)

module.exports = MemberDetailsModel
