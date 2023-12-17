const mongoose = require("mongoose");
// const Joi = require("joi");

// const { string } = Joi;

const Schema = mongoose.Schema;

const MemberInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
});

const MemberDetailsModel = mongoose.model("MemberDetail", MemberInfoSchema);

module.exports = MemberDetailsModel;
