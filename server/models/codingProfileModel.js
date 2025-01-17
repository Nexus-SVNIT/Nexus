const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const codingProfileSchema = new Schema({
    userId:{
        type:String,
        required: true
    },
    platform:{
        type:String,
        required: true
    },
    data:{
        type:Object,
        required: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('CodingProfile', codingProfileSchema);