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
}, {
    timestamps: true
});

codingProfileSchema.index({ platform: 1, sortingKey: -1 });

module.exports = mongoose.model('CodingProfile', codingProfileSchema);