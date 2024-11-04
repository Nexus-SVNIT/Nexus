const { string, required } = require("joi");
const mongoose = require("mongoose");

const teamMembersSchema = new mongoose.Schema({
    admissionNumber: {
        type: String,
        required: true,
    },
    role:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    year:{
        type:String,
        required:true,
    },
    email: {
        type: String,
        required: true,
    }
});

const teamMembersModel = mongoose.model("teamMembers", teamMembersSchema);

module.exports = teamMembersModel;
