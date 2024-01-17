const { string } = require("joi");
const mongoose = require("mongoose");





const MemberInfoSchema = new mongoose.Schema({
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
    socialLinks:{
        facebookLink:{
            type:String,
            required:true,
        },
        linkedinLink:{
            type:String,
            required:true,
        },
        instagramLink:{
            type:String,
            required:true,
        }
    }
});

const MemberDetailsModel = mongoose.model("MemberDetail", MemberInfoSchema);

module.exports = MemberDetailsModel;
