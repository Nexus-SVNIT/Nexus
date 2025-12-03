const mongoose = require('mongoose');
// No need to require the resource model here for the schema definition
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    category: {
        type: String,
        enum: ['Placements/Internships', 'Semester Exams'],
        required: true
    },
    subjectName: {
        type: String,
        required: true
    },
    tips: {
        type: String,
        required: true 
    },
   
    resources: [{
        type: Schema.Types.ObjectId,
        ref: 'Resource'
    }],
    url: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Subject', subjectSchema);