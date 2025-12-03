const mongoose=require('mongoose');
const subject=require('./subjectSchema');
const Schema=mongoose.Schema;

const ResourceSchema=new Schema({
    
    
    title:{
        type:String,
        required:true
    },
    subCategory:{
        type:String,
        required:true,
        enum:['Books','Notes','Important topics','Youtube Resources','Other']
    },
    resourcetype:{
        type:String,
        required:true,
        enum:['PDF','Link']
    },
    Link:{
        type:String,
        required:true
    }
    
})

module.exports=mongoose.model('Resource',ResourceSchema);