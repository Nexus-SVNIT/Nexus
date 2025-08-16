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
    receivePayment: {  
        type: Boolean,
        default: false
    },
    amount:{
        type:Number,
        default:0
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
    },
    isHidden: {
        type: Boolean,
        default: false
    },
    isOpenForAll: {
        type: Boolean,
        default: false
    },
    sheetId: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        ref: 'coreMember'
    },
    createdByAdmissionNumber: {
        type: String,
        required: true
       
    },
    createdByRole: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('form', formSchema);
