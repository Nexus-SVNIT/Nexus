const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const formSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    desc: {
        type: String,
        required: true,
        trim: true
    },
    deadline: {
        type: String,
        required: true
    },
    created_date: {
        type: String,
        default: new Date().toISOString()
    },
    publish: {
        type: Boolean,
        default: false
    },
    formFields: {
        type: [Object],
        default: []
    },
    responses: {
        type: [Object],
        default: []
    },
    _event: {
        type: String,
        ref: 'Event',
        default: 'none'
    },
    WaLink:{
        type:String,
        
    }
    
});

module.exports = mongoose.model('form', formSchema);
