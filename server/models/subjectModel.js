const mongoose = require('mongoose');
// No need to require the resource model here for the schema definition
const Schema = mongoose.Schema;

const subjectModel = new Schema({
    category: {
        type: String,
        enum: ['Placements/Internships', 'Semester Exams'],
        required: true
    },
    subjectName: {
        type: String,
        required: true
    },//LLD,OOP etc
    tips: {
        type: String,
        required: true 
    },//general tips from the seniors
   
    resources: [{
        type: Schema.Types.ObjectId,
        ref: 'Resource'
    }], // reference of the resourcees
    
});

module.exports = mongoose.model('Subject', subjectModel);