const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contestsSchema = new Schema({
    data:{
        type:Object,
        required: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Contests', contestsSchema);