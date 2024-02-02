const mongoose = require('mongoose');
const Forms = mongoose.model('form');

const handleError = (res, err) => {
    console.error(err);
    res.status(500).json(err);
};

const getPublicForms = async (req, res) => {
    try {
        const allForms = await Forms.find({ publish: true })
            .select({
                "responseCount": { $size: "$responses" },
                name: true,
                desc: true,
                deadline: true,
                formFields: true,
                _event: true
            });
        res.status(200).json(allForms);
    } catch (err) {
        handleError(res, err);
    }
};
const getAllForms = async (req, res) => {
    try {
        const allForms = await Forms.find()
            .select({
                "responseCount": { $size: "$responses" },
                name: true,
                deadline: true,
                publish: true
            });;
        res.status(200).json(allForms);
    } catch (err) {
        handleError(res, err);
    }
};

const createForm = async (req, res) => {
    const { name, desc, deadline, formFields } = req.body;
    const _event = "none";
    try {
        const createdForm = await Forms.create({ name, desc, deadline, formFields, _event });
        res.status(200).json(createdForm);
    } catch (err) {
        handleError(res, err);
    }
};

const submitResponse = async (req, res) => {
    const id = req.params.id;
    const { email } = req.body;

    try {



        // Check if the deadline has not been missed
        const formDetails = await Forms.findById(id).select({ deadline: true });
        // const currentTimestamp = Date.now();
        // const deadlineTimestamp = new Date(formDetails.deadline).getTime();
        const currentDate = new Date();
        const [day, month, year] = formDetails.deadline.split("-").map(Number);
        const deadlineDate = new Date(year, month - 1, day, 22, 30, 0);


        if (deadlineDate < currentDate) {
            // If the deadline has been missed, send an error response
            return res.status(400).json({
                success: false,
                message: "The deadline has passed. Your response was not saved.",
            });
        }

        // If email doesn't exist and the deadline has not been missed, proceed with updating the form
        const form = await Forms.findByIdAndUpdate(
            id,
            { $push: { responses: req.body } },
            { new: true }
        );

        const responseMessage = {
            success: true,
            message: "Your response has been successfully saved.",
            WaLink: form?.WaLink || "https://chat.whatsapp.com/GYGe2OaR0JHIRU8Kmpm5Hb",
        };

        res.status(200).json(responseMessage);
    } catch (err) {
        handleError(res, err);
    }
};



const getResponses = async (req, res) => {
    const id = req.params.id;
    try {
        const responses = await Forms.findById(id).select({ responses: true, _id: false });
        if (!responses) throw new Error("Event not found");
        res.status(200).json(responses);
    } catch (err) {
        handleError(res, err);
    }
};

const getFormFields = async (req, res) => {
    const id = req.params.id;
    try {
        const formFields = await Forms.findById(id).select({ _id: false, responses: false, __v: false, responseCount: false, _event: false });
        if (!formFields) throw new Error("Event not found");
        res.status(200).json(formFields);
    } catch (err) {
        handleError(res, err);
    }
};

module.exports = { getAllForms, getPublicForms, createForm, submitResponse, getResponses, getFormFields };
