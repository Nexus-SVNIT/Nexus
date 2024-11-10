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
    WaLink: {
        type: String,
    },
    enableTeams: {
        type: Boolean,
        default: false
    },
    teamSize: {
        type: Number,
        required: function() {
            return this.enableTeams;
        },
        min: [1, 'Team size must be at least 1']
    },
    fileUploadEnabled: {
        type: Boolean,
        default: false
    },
    driveFolderId: {
        type: String,
        required: function () {
            return this.fileUploadEnabled;
        }
    },
    receivePayment: {  // Field to specify if payment is required
        type: Boolean,
        default: false
    },
    amount:{
        type:Number,
        default:0
    },
    qrCodeUrl: {  // Field to store QR code URL for payment
        type: String,
        required: function() {
            return this.receivePayment;
        }
    },
    payments: {  // New field to track payment details per response
        type: [{
            responseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Response' },
            paymentId: { type: String, required: true },
            screenshotUrl: { type: String, required: true }, // URL to screenshot of payment
            paymentStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' }
        }],
        default: []
    },
    posterImageDriveId:{
        type: String,
        default: ''
    },
    extraLinkName:{
        type: String,
        default: ''
    },
    extraLink:{
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('form', formSchema);
