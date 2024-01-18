const mongoose = require('mongoose');
const Forms = mongoose.model('form');
const getAllForms = async(req, res)=>{
    try{
        const allForms = await Forms.find().select({formFields: false, responses: false});
        res.status(200).json(allForms);
    }
    catch (err){
        res.status(500).json(err);
    }
}
const createForm = async (req, res) => {
    const {name, desc, deadline, formFields} = req.body;
    const _event = "none";
    try {
        const createdForm = await Forms.create({name, desc, deadline, formFields, _event});
        res.status(200).json(createdForm);
    } catch (err) {
        res.status(500).json(err);
    }
};

const submitResponse = async (req, res) => {
    const formName = req.params.id;
    await Forms.findOneAndUpdate(
        { name: formName },
        { $push: { responses: req.body }, $inc: {responseCount: 1} },
        { new: true } 
    );
res.status(200).json("Response Saved Successfully");
};

const getResponses = async (req, res) => {
    const formName = req.params.id;
    const responses = await Forms.findOne({ name: formName }).select({responses: true});
    if (!responses) throw new ExpressError("Event not found", 404);
    res.status(200).json(responses);
};

const getFormFields = async (req, res) => {
    const formName = req.params.id;
    const formFields = await Forms.findOne({ name: formName }).select({formFields: true});
    if (!formFields) throw new ExpressError("Event not found", 404);
    res.status(200).json(formFields);
}

module.exports = {getAllForms, createForm, submitResponse, getResponses, getFormFields};