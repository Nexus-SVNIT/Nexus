const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    eventName: {
        type: String,
        required: true,
    },
    eventType: {
        type: String,
    },
    eventDate: {
        type: String,
        required: true,
    },
    eventDescription: {
        type: String,
        required: true,
    },
    eventPoster: {
        type: String,
        required: true,
    },
    eventStatus: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("event", eventSchema);
