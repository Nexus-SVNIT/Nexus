const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    eventName: {
        type: String,
        required: true
    },
    eventDate: {
        type: String,
        required: true
    },
    formFields: [Object],
    responseCollectionName: String,
    responseSchema: Object
});

module.exports = mongoose.model('event', eventSchema);