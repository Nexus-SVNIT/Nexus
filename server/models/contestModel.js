const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contestSchema = new Schema({
    time: {
        type: Date,
        required: true,
        default: new Date()
    },
    data: {
        type: Object,
        required: true
    },
});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;