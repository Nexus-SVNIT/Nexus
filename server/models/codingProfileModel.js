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
        required: true
    },
    fullName:{
        type: String,
        required: true
    },
    platform:{
        type: String,
        required: true,
    },
    profileId:{
        type: String,
        required: true
    },
    sortingKey:{
        type: Number,
        required: true
    },
    data:{
        type:Object,
        required: true,
        timestamps: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('CodingProfile', codingProfileSchema);