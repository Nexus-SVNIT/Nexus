const mongoose = require('mongoose');
const Forms = mongoose.model('form');
const newmember = require("../models/newmemberModel.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require('../models/userModel.js'); // Adjust the path as necessary
const { sendEmail } = require('../utils/emailUtils.js'); // Adjust the path to your nodemailer utility

const handleError = (res, err) => {
    console.error(err);
    res.status(500).json(err);
};

const notifyAllSubscribers = async (formId) => {
    try {
        // Fetch the form details by ID
        const form = await Forms.findById(formId);
        if (!form) {
            console.error(`Form with ID ${formId} not found.`);
            return;
        }

        // Fetch users who are subscribed
        const subscribers = await User.find({ subscribed: true });

        // Notification link to apply
        const linkToApply = 'https://www.nexus-svnit.tech/forms';

        // Notify each subscriber
        subscribers.forEach(async (subscriber) => {
            const emailContent = {
                to: subscriber.personalEmail,
                subject: `New Form Realesed: ${form.name}`,
                text: `New Form Realesed: ${form.name}. Apply before deadline.`,
                // text: `Hello ${subscriber.fullName},\n\n` +
                //     `A new form has been realesed:\n` +
                //     `Name: ${form.name}\n` +
                //     `Description: ${form.desc}\n` +
                //     `Deadline: ${form.deadline}\n` +
                //     `Link to apply: ${linkToApply}\n\n` +
                //     `Best regards,\nTeam Nexus`,
                html: `
                    <div style=" background-color: black; color:white; font-size:12px; padding:20px;">
                    <div style=" padding:10px; width:60%; display:flex; justify-content: center;"><img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC"/></div>
                    <div> Dear ${subscriber.fullName},</div>
                    <p style="">A new form has been realesed:</p>
                    <table>
                    <tr><td>Name:</td><td>${form.name}</td></tr>
                    <tr><td>Description:</td><td>${form.desc}</td></tr>
                    <tr><td>Deadline:</td><td>${form.deadline}</td></tr>
                    <tr><td>Link to apply:</td><td><a href="${linkToApply}/${formId}">Apply Now</a></td></tr>
                    </table>
                    <p> Thanks,<br>Team NEXUS</p>
                    </div>
                    `
            };

            try {
                await sendEmail(emailContent);
                // console.log(`Notified ${subscriber.personalEmail} about new form: ${formId}`);
            } catch (error) {
                console.error(`Failed to send email to ${subscriber.personalEmail}:`, error);
            }
        });
    } catch (error) {
        console.error(`Error notifying subscribers:`, error);
    }
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
            .sort({ created_date: -1 }); 
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
    const { name, desc, deadline, formFields, WaLink, enableTeams, teamSize } = req.body;
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

    // Validate team size if enableTeams is true
    let teamData = {};
    if (enableTeams) {
        if (teamSize && teamSize > 0) {
            teamData = { enableTeams, teamSize };
        } else {
            return res.status(400).json({ error: "Invalid team size. It should be a positive integer." });
        }
    }

    try {
        const createdForm = await Forms.create({
            name,
            desc,
            deadline: formattedDeadline,
            created_date,
            publish,
            formFields,
            WaLink,
            _event,
            ...teamData // Spread the team data if teams are enabled
        });
        res.status(200).json(createdForm);
    } catch (err) {
        handleError(res, err);
    }
};


const submitResponse = async (req, res) => {
    const id = req.params.id;
    const admissionNumber = req.user?.admissionNumber;

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

        // Check if the user has already submitted the form
        const existingForm = await Forms.findOne({
            _id: id,
            "responses.admissionNumber": admissionNumber
        });

        if (!existingForm && formDetails.enableTeams) {
            const { teamMembers } = req.body;
            for (const admissionNumber of teamMembers) {
            const existingMemberForm = await Forms.findOne({
                _id: id,
                "responses.teamMembers": admissionNumber
            });
            if (existingMemberForm) {
                return res.status(400).json({
                success: false,
                message: `Team member with admission number ${admissionNumber} has already registered.`,
                });
            }
            }
        }

        if (existingForm) {
            return res.status(400).json({
                success: false,
                message: "Already Registered.",
            }); // User has already submitted
        }

        if(formDetails.enableTeams){
            const { teamName } = req.body;
            const existingTeam = await Forms.findOne({
                _id: id,
                "responses.teamName": teamName
            });
            if (existingTeam) {
                return res.status(400).json({
                    success: false,
                    message: "Team Name already exists.",
                }); // Team Name already exists
            }
        }

        // Update the form with the new response
        const form = await Forms.findByIdAndUpdate(
            id,
            { $push: { responses: { ...req.body, admissionNumber } } },
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
        // Fetch responses along with user details by admissionNumber
        const form = await Forms.findById(id).select({ responses: true, _id: false });
        
        if (!form) throw new Error("Form not found");

        const responseWithUserDetails = await Promise.all(
            form.responses.map(async (response) => {
                const user = await User.findOne({ admissionNumber: response.admissionNumber }).lean();
                return {
                    ...response,
                    user: user || null,
                };
            })
        );

        res.status(200).json({ responses: responseWithUserDetails });
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

module.exports = {
    getAllForms,
    getPublicForms,
    createForm,
    submitResponse,
    getResponses,
    getFormFields,
    updateFormStatus,
    updateFormDeadline,
    notifyAllSubscribers,
    
};
