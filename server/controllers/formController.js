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
    console.log(formName,req.body);
    return res.status(200).json("Response Saved Successfully");
};

const getResponses = async (req, res) => {
    const formName = req.params.id;
    const responses = await Forms.findOne({ name: formName }).select({responses: true});
    if (!responses) throw new ExpressError("Event not found", 404);
    res.status(200).json(responses);
};

const getFormFields = async (req, res) => {
    
    try {
        const formData = await Forms.findById(req.params.id).select("-__v -_event -responses");
       
        if (!formData) throw new ExpressError("Event not found", 404);
        return res.status(200).json(formData);
    } catch (error) {
        return res.status(500).json("Something went wrong")
    }
}

module.exports = {getAllForms, createForm, submitResponse, getResponses, getFormFields};