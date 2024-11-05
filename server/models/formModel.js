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
        
    },
    enableTeams: {  // New field to specify if teams are enabled
        type: Boolean,
        default: false
    },
    teamSize: {  // New field to specify the required team size if teams are enabled
        type: Number,
        required: function() {
            return this.enableTeams;  // teamSize is required only if enableTeams is true
        },
        min: [1, 'Team size must be at least 1']
    }

    
});

module.exports = mongoose.model('form', formSchema);
