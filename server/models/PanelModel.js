const mongoose = require('mongoose');

const PanelSchema = new mongoose.Schema({
    panelNumber: { type: String, required: true },
    interviewers: [{
        name: { type: String, required: true },
        email: { type: String, required: true }
    }],
    candidates: [{
        email: { type: String, required: true },
        interviewTime: { type: Date, required: true }  // Store as Date for better handling
    }],
    startTime: { type: Date, required: true },          // Panel start time
    interviewDuration: { type: Number, required: true },  // Duration of each interview in minutes
    panelLink: { type: String, required: true },       // Link for the panel's interviews
    form: { type: mongoose.Schema.Types.ObjectId, ref: 'form', required: true }, // Reference to the form
    emailsSent: { 
        interviewers: [{ type: String }], // Track which interviewers have been sent emails
        candidates: [{ type: String }]    // Track which candidates have been sent emails
    }
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

module.exports = mongoose.model('Panel', PanelSchema);
