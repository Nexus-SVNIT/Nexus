const mongoose=require('mongoose');
const subject=require('./subjectModel');
const Schema=mongoose.Schema;

const ResourceSchema=new Schema({
    
    
    title:{
        type:String,
        required:true   
    },//DAA 2024 ENDSEM PYQ
    subCategory:{
        type:String,
        required:true,
        enum:['Notes','Important topics','Youtube Resources','PYQs','Other']
    },//Notes
    resourcetype:{
        type:String,
        required:true,
        enum:['PDF','Link']
    },
    Link:{
        type:String,
        required:true
    }// drive/youtube link
    
})

module.exports=mongoose.model('Resource',ResourceSchema);