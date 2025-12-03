// models/resourcesModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
    title: { type: String, required: true, trim: true },

    subCategory: {
        type: String,
        required: true,
        enum: ['Notes', 'Important Topics', 'YouTube Resources', 'PYQs', 'Other'],
        trim: true
    },

    resourceType: {
        type: String,
        required: true,
        enum: ['PDF', 'Link']
    },

    link: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: v => /^https?:\/\//.test(v),
            message: "Invalid URL format"
        }
    },

    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
        index: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
