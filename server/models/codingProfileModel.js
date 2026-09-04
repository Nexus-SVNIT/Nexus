const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const codingProfileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    admissionNo:{
        type: String,
        required: true,
        index: true
    },
    fullName:{
        type: String,
        required: true,
        index: true
    },
    platform:{
        type: String,
        required: true,
        index: true
    },
    profileId:{
        type: String,
        required: true
    },
    sortingKey:{
        type: Number,
        required: true,
        index: -1
    },
    data:{
        type:Object,
        required: true,
        timestamps: true
    },
    branch: {
        type: String,
        index: true
    },
    year: {
        type: String,
        index: true
    },
    program: {
        type: String,
        index: true
    },
    status: {
        type: String,
        index: true
    },
    nexusRank: {
        type: Number,
        index: true
    }
}, {
    timestamps: true
});

codingProfileSchema.index({ platform: 1, sortingKey: -1 });
codingProfileSchema.index({ platform: 1, branch: 1 });
codingProfileSchema.index({ platform: 1, year: 1 });
codingProfileSchema.index({ platform: 1, status: 1 });

module.exports = mongoose.model('CodingProfile', codingProfileSchema);