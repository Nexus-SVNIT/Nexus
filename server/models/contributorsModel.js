const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contributorSchema = new Schema({
    githubId: String,
    contributions: Number,
    avatar_url: String,
    html_url: String
}, { _id: false });

const contributorsSchema = new Schema({
    year: { 
        type: Number, 
        required: true, 
        unique: true, 
        index: true 
    },
    total: {
        type: Number, 
        required: true 
    },
    contributors: [contributorSchema]
}, {
    timestamps: true,
})

module.exports = mongoose.model('Contributors', contributorsSchema);