const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subCategory: {
    type: String,
    required: true,
    enum: ['Notes', 'Important topics', 'Youtube Resources', 'PYQs', 'Other'],
    trim: true
  },
  resourceType: {  
    type: String,
    required: true,
    enum: ['PDF', 'Link']
  },
  link: {  
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
    index: true 
  }
}, {
  timestamps: true
});


resourceSchema.index({ subject: 1, subCategory: 1 }); 
resourceSchema.index({ createdAt: -1 });              
resourceSchema.index({ title: 1 });                   

module.exports = mongoose.model('Resource', resourceSchema);
