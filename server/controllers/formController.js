const mongoose = require('mongoose');
const Forms = mongoose.model('form');


const getAllForms = async (req, res) => {
    try {
        const allForms = await Forms.find({ publish: true }, {
            "responseCount": { $size: "$responses" },
            name: true,
            desc: true,
            deadline: true,
            formFields: true,
            _event: true
        });
        res.status(200).json(allForms);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

const createForm = async (req, res) => {
    const { name, desc, deadline, formFields } = req.body;
    const _event = "none";
    try {
        const createdForm = await Forms.create({ name, desc, deadline, formFields, _event });
        res.status(200).json(createdForm);
    } catch (err) {
        res.status(500).json(err);
    }
};

const submitResponse = async (req, res) => {
    const id = req.params.id;
    const formDetails = await Forms.findById(id).select({ deadline: true }); // formDetails will be an object 

    const form = await Forms.findByIdAndUpdate(
        id,
        { $push: { responses: req.body } },
        { new: true }
    );
    return res.status(200).json({ success: true, message: "You're response has been successfully saved.", WaLink: form?.WaLink ?? "https://chat.whatsapp.com/GYGe2OaR0JHIRU8Kmpm5Hb" });
};

const getResponses = async (req, res) => {
    const id = req.params.id;
    const responses = await Forms.findById(id).select({ responses: true, _id: false });
    if (!responses) throw new ExpressError("Event not found", 404);
    res.status(200).json(responses);
};

const getFormFields = async (req, res) => {
    const id = req.params.id;
    const formFields = await Forms.findById(id).select({ _id: false, responses: false, __v: false, responseCount: false, _event: false });
    if (!formFields) throw new ExpressError("Event not found", 404);
    res.status(200).json(formFields);
}

module.exports = { getAllForms, createForm, submitResponse, getResponses, getFormFields };