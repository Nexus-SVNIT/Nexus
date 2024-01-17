const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const formSchema = new Schema({
    name: String,
    desc: String,
    deadline: String,
    created_date: String,
    formFields: {
        type: [Object],
        default: []
    },
    responses: {
        type: [Object],
        default: []
    },
    responseCount:{
        type: Number,
        default: 0
    },
    _event: {
        type: String,
        ref: 'event'
    }
});

module.exports = mongoose.model("form", formSchema);