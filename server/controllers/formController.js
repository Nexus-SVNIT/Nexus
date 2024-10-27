const mongoose = require('mongoose');
const Forms = mongoose.model('form');
const newmember = require("../models/newmemberModel.js");
const ExpressError = require("../utils/ExpressError.js");

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
            })
            .sort({ created_date: -1 }); // Sort by creation date, descending
        res.status(200).json(allForms);
    } catch (err) {
        handleError(res, err);
    }
};

const updateFormStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { publish } = req.body;

        // Validate input
        if (typeof publish !== 'boolean') {
            return res.status(400).json({ success: false, message: 'Invalid input' });
        }

        // Find the form and update its status
        const form = await Forms.findById(id);
        if (!form) {
            return res.status(404).json({ success: false, message: 'Form not found' });
        }

        form.publish = publish;
        await form.save();

        res.json({ success: true, message: 'Form status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateFormDeadline = async (req, res) => {
    try {
        const { id } = req.params;
        const { deadline } = req.body;



        // Validate input
        if (!deadline || !/^\d{2}-\d{2}-\d{4}$/.test(deadline)) {
            return res.status(400).json({ success: false, message: 'Invalid deadline format. Expected format: DD-MM-YYYY' });
        }

        // Find the form and update its deadline
        const form = await Forms.findById(id);
        if (!form) {
            return res.status(404).json({ success: false, message: 'Form not found' });
        }

        form.deadline = deadline;
        await form.save();

        res.json({ success: true, message: 'Form deadline updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};






const createForm = async (req, res) => {
    const { name, desc, deadline, formFields, WaLink } = req.body;
    const _event = "none";  // Set a default value for _event if it's not provided

    // Convert deadline to dd-mm-yy format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
    };

    const formattedDeadline = formatDate(deadline);
    const created_date = new Date().toISOString();
    const publish = false;

    try {
        const createdForm = await Forms.create({
            name,
            desc,
            deadline: formattedDeadline,
            created_date,
            publish,
            formFields,
            WaLink,
            _event
        });
        res.status(200).json(createdForm);
    } catch (err) {
        handleError(res, err);
    }
};

const submitResponse = async (req, res) => {
    const id = req.params.id;
    const admissionNumber = req.user?.admissionNumber;
    const userId = req.user?.id;

    try {
        // Retrieve form details
        const formDetails = await Forms.findById(id).select();
        const deadlineDate = formDetails.deadline;
        const currentDate = Date.now();

        // Check if the deadline has been missed
        if (deadlineDate < currentDate) {
            return res.status(400).json({
                success: false,
                message: "The deadline has passed. Your response was not saved.",
            });
        }

        try {
            const form = await Forms.findOne({
                'responses.admissionNumber': admissionNumber
            });

            if (form) {
                return res.status(400).json({
                    success: false,
                    message: "Already Registered.",
                }); // User has already submitted
            } 

        } catch (error) {
            handleError(res, err);
        }

        // // Check if the form contains an email field
        // const hasEmailField = formDetails.formFields.some(field =>
        //     field.questionText.toLowerCase().includes('email')
        // );

        // let existingResponse = null;

        // // If the form has an email field, extract and validate the email
        // if (hasEmailField) {
        //     const emailField = formDetails.formFields.find(field =>
        //         field.questionText.toLowerCase().includes('email')
        //     );

        //     // Extract email from req.body
        //     const email = req.body[emailField.questionText];

        //     if (!email) {
        //         return res.status(400).json({
        //             success: false,
        //             message: "Email field is required.",
        //         });
        //     }

        //     // Check if the email already exists in the form responses
        //     existingResponse = await Forms.findOne({ _id: id, "responses.Email": email });
        //     if (existingResponse) {
        //         return res.status(400).json({
        //             success: false,
        //             message: "Email already exists. Your response was not saved.",
        //         });
        //     }
        // }

        // Update the form with the new response
        const form = await Forms.findByIdAndUpdate(
            id,
            { $push: { responses: {...req.body, admissionNumber} } },
            { new: true }
        );

        const responseMessage = {
            success: true,
            message: "Your response has been successfully saved.",
            WaLink: form?.WaLink,
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

module.exports = { getAllForms, getPublicForms, createForm, submitResponse, getResponses, getFormFields, updateFormStatus, updateFormDeadline };
