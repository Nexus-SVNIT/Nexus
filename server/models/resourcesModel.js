const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subCategory: {
        type: String,
        required: true,
        enum: ['Notes', 'Important topics', 'Youtube Resources', 'PYQs', 'Other'],
        trim: true
    },
    resourceType: {  // consistent camelCase
        type: String,
        required: true,
        enum: ['PDF', 'Link']
    },
    link: {  // lowercase field name
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
        index: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
