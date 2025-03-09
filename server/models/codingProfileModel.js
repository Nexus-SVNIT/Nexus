const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const codingProfileSchema = new Schema({
    platform:{
        type:String,
        required: true
    },
    data:{
        type:[Object],
        required: true,
        timestamps: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('CodingProfile', codingProfileSchema);