const { string, required } = require("joi");
const mongoose = require("mongoose");

const newMemberInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role:{
        type:String,
        required:true,
    },
    email: {
        type: String,
        required: true,
    },
    image:{
        type:String,
        // required:true,
    },
    admNo:{
        type:String,
        required:true,
    },
    socialLinks: {
        linkedinLink: {
            type: String,
        },
        githubLink: {
            type: String,
        },
    }
});

const newMemberDetailsModel = mongoose.model("newMemberDetail", newMemberInfoSchema);

module.exports = newMemberDetailsModel;
