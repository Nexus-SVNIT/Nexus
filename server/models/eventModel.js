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
        index: true
    },
    eventDescription: {
        type: String
    },
    eventPoster: {
        type: String
    },
    eventStatus: {
        type: String
    },
    eventImages: {
        type: [String]
    },
    participants: {
        type: Number
    }
});

module.exports = mongoose.model("event", eventSchema);