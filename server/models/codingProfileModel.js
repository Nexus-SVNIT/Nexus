const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const codingProfileSchema = new Schema({
    userId:{
        type: String,
        required: true
    },
    codeforces: {
        type: Object,
        default: ''
    },
    codechef: {
        type: Object,
        default: ''
    },
    leetcode: {
        type: Object,
        default: ''
    },
});

const CodingProfile = mongoose.model('CodingProfile', codingProfileSchema);

module.exports = CodingProfile;