const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    category: {
        type: String,
        required: true,
        enum: ['Semester Exams', 'Placements/Internships'],
        trim: true
    },
    subjectName: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        enum: ['CSE', 'AI', 'Common'],
        trim: true
    },
    tips: {
        type: [{ text: String, createdAt: { type: Date, default: Date.now } }],
        default: []
    },
    resources: [{
        type: Schema.Types.ObjectId,
        ref: 'Resource'
    }],
}, {
    timestamps: true
});


subjectSchema.index({ subjectName: 1, department: 1 }, { unique: true });


module.exports = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);