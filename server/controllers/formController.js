const mongoose = require('mongoose');
const Forms = require('../models/formModel.js');
const User = require('../models/userModel.js');

const TeamMember = require('../models/teamMembersModel');
const { sendEmail } = require('../utils/emailUtils.js');
const { 
    formEmailTemplate, 
    personalizedBatchTemplate,
    formCreationNotificationTemplate,
    formNotificationSummaryTemplate
} = require('../utils/emailTemplates.js');
const { google } = require('googleapis');
const { uploadImageToDrive, getCredentials } = require('../utils/driveUtils.js');

// Get authenticated Drive and Sheets clients
const auth = new google.auth.GoogleAuth({
    credentials: getCredentials(),
    scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

// Error handling utility
const handleError = (res, err) => {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
};

// Get public forms
const getPublicForms = async (req, res) => {
    try {
        const allForms = await Forms.find({ isHidden: false })
            .select({
                "responseCount": { $size: "$responses" },
                name: true,
                desc: true,
                deadline: true,
                formFields: true,
                publish: true,
                _event: true
            });
        res.status(200).json(allForms);
    } catch (err) {
        handleError(res, err);
    }
};

// Submit a response to a form
const submitResponse = async (req, res) => {
    const id = req.params.id;
    let admissionNumber = null;

    try {
        // Retrieve form details
        const formDetails = await Forms.findById(id).select();
        const deadlineDate = new Date(formDetails.deadline).getTime();
        const currentDate = Date.now();

        // Check if the deadline has been missed or form is not published
        if (deadlineDate < currentDate || !formDetails.publish) {
            return res.status(400).json({
                success: false,
                message: "The deadline has passed. Your response was not saved.",
            });
        }

        // For forms that aren't open to all, validate user authentication
        if (!formDetails.isOpenForAll) {
            if (!req.user?.admissionNumber) {
                return res.status(403).json({
                    success: false,
                    message: "You must be logged in to submit this form.",
                });
            }
            admissionNumber = req.user.admissionNumber;
        }

        // Check for duplicate submission
        const existingForm = await Forms.findOne({
            _id: id,
            "responses.admissionNumber": admissionNumber
        });

        if (existingForm) {
            return res.status(400).json({
                success: false,
                message: "Already Registered.",
            });
        }

        // Validate team registration
        if (formDetails.enableTeams) {
            // Check for team member validation
            if (!existingForm && formDetails.enableTeams) {
                const teamMembers = JSON.parse(req.body.teamMembers);
                req.body.teamMembers = teamMembers;
                
                // Verify each team member doesn't already exist in another team
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

                    // Verify team member exists
                    const existingMember = await User.findOne({ admissionNumber });
                    if (!existingMember) {
                        return res.status(400).json({
                            success: false,
                            message: `Team member with admission number ${admissionNumber} does not exist.`,
                        });
                    }
                }
            }

            // Validate team name uniqueness
            const { teamName } = req.body;
            const existingTeam = await Forms.findOne({
                _id: id,
                "responses.teamName": teamName
            });
            
            if (existingTeam) {
                return res.status(400).json({
                    success: false,
                    message: "Team Name already exists.",
                });
            }
        }

        

        // Handle file upload if required
        if (formDetails.fileUploadEnabled) {
            if (!req.file && !req.files?.file) {
                return res.status(400).json({ message: "File upload is required" });
            }
            
            // Use driveUtils to upload file
            const uploadResult = await uploadImageToDrive(req, formDetails.driveFolderId);
            if (!uploadResult.success) {
                return res.status(500).json({ message: `Error uploading file: ${uploadResult.error}` });
            }
            req.body.files = uploadResult.fileId;
        }

        // Process form data
        const body = req.body;
        for(const key in body){
            if(body[key][0] === '"' && body[key][body[key].length-1] === '"'){
                body[key] = body[key].slice(1, body[key].length-1);
            }
        }

        body.dateTime = new Date();

        // Save response to the form
        const form = await Forms.findByIdAndUpdate(
            id,
            { $push: { responses: { ...body, admissionNumber } } },
            { new: true }
        );

        // Extract fields for Google Sheet
        const resTeamName = body.teamName;
        delete body.teamName;
        
        const resTeamMembers = body.teamMembers;
        delete body.teamMembers;

        const resFiles = body.files;
        delete body.files;
        
        const resDate = body.dateTime;
        delete body.dateTime;

        // Add response to Google Sheet
        if (form.sheetId) {
            let userData = null;
            if(admissionNumber){
                userData = await User.findOne({admissionNumber});
            }
            
            const values = Object.values({
                admissionNumber,
                name: userData?.fullName || 'Guest User',
                mobileNumber: userData?.mobileNumber || 'N/A',
                personalEmail: userData?.personalEmail || 'N/A',
                branch: userData?.branch || 'N/A',
                ...body,
            });
            
            if(form.enableTeams){
                values.push(resTeamName)
                values.push(JSON.stringify(resTeamMembers))
            }
            
            if(form.fileUploadEnabled){
                values.push(`https://drive.google.com/file/d/${resFiles}/view`)
            }
            
            values.push(new Date(resDate).toLocaleString())

            await sheets.spreadsheets.values.append({
                spreadsheetId: form.sheetId,
                range: 'Sheet1',
                valueInputOption: 'RAW',
                resource: {
                    values: [values],
                },
            });
        }

        // Return success response
        res.status(200).json({
            success: true,
            message: "Your response has been successfully saved.",
            WaLink: form?.WaLink,
        });
    } catch (err) {
        handleError(res, err);
    }
};

// Submit an open form response (no login required)
const submitOpenResponse = async (req, res) => {
    const id = req.params.id;
    const admissionNumber = null; // No admission number for open forms

    try {
        const formDetails = await Forms.findById(id).select();
        const deadlineDate = formDetails.deadline;
        const currentDate = Date.now();

        // Check deadline and if form is published
        if (deadlineDate < currentDate || !formDetails.publish) {
            return res.status(400).json({
                success: false,
                message: "The deadline has passed. Your response was not saved.",
            });
        }

        // Validate form is open for all
        if (!formDetails.isOpenForAll) {
            return res.status(400).json({
                success: false,
                message: "This form is not open for public submission.",
            });
        }

        // Handle team validation for open forms
        if (formDetails.enableTeams) {
            const { teamName } = req.body;
            const existingTeam = await Forms.findOne({
                _id: id,
                "responses.teamName": teamName
            });
            
            if (existingTeam) {
                return res.status(400).json({
                    success: false,
                    message: "Team Name already exists.",
                });
            }
        }

       
        // Handle file upload
        if (formDetails.fileUploadEnabled) {
            if (!req.file && !req.files?.file) {
                return res.status(400).json({ message: "File upload is required" });
            }
            
            // Use driveUtils to upload file
            const uploadResult = await uploadImageToDrive(req, formDetails.driveFolderId);
            if (!uploadResult.success) {
                return res.status(500).json({ message: `Error uploading file: ${uploadResult.error}` });
            }
            req.body.files = uploadResult.fileId;
        }

        // Process form data
        const body = req.body;
        for(const key in body){
            if(body[key][0] === '"' && body[key][body[key].length-1] === '"'){
                body[key] = body[key].slice(1, body[key].length-1);
            }
        }

        body.dateTime = new Date();

        // Save response to the form
        const form = await Forms.findByIdAndUpdate(
            id,
            { $push: { responses: { ...body, admissionNumber } } },
            { new: true }
        );

        // Extract fields for Google Sheet
        const resTeamName = body.teamName;
        delete body.teamName;
        
        const resTeamMembers = body.teamMember;
        delete body.teamMembers;

        const resFiles = body.files;
        delete body.files;

        const resDate = body.dateTime;
        delete body.dateTime;

        // Add response to Google Sheet
        if (form.sheetId) {
            const values = Object.values(body);
            if(form.enableTeams){
                values.push(resTeamName)
                values.push(JSON.stringify(resTeamMembers))
            }
            if(form.fileUploadEnabled){
                values.push(`https://drive.google.com/file/d/${resFiles}/view`)
            }
            values.push(new Date(resDate).toLocaleString())
            
            await sheets.spreadsheets.values.append({
                spreadsheetId: form.sheetId,
                range: 'Sheet1',
                valueInputOption: 'RAW',
                resource: {
                    values: [values],
                },
            });
        }

        // Return success response
        res.status(200).json({
            success: true,
            message: "Your response has been successfully saved.",
            WaLink: form?.WaLink,
        });
    } catch (err) {
        handleError(res, err);
    }
};

// Get form fields (for display)
const getFormFields = async (req, res) => {
    const id = req.params.id;
    try {
        const formFields = await Forms.findById(id).select({ _id: false, responses: false, __v: false, responseCount: false, _event: false });
        if (!formFields) throw new Error("Form not found");
        res.status(200).json(formFields);
    } catch (err) {
        handleError(res, err);
    }
};

// Notify all subscribers about a form 

// hold for while need to implement batch wise form notification
const notifyAllSubscribers = async (req, res) => {
    try {
        const formId = req.params.formId;
        const form = await Forms.findById(formId);

        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        // Fetch core member who created the notification
        const coreMember = await TeamMember.findById(req.user.id).select('email admissionNumber');
        const formCreator = form.createdByAdmissionNumber || (coreMember ? coreMember.admissionNumber : 'NEXUS Core Team');
        
        // Find all subscribed users
        const subscribers = await User.find({ subscribed: true });
        if (subscribers.length === 0) {
            return res.status(200).json({ message: "No subscribers to notify" });
        }

        // Get all recipient emails
        const bccRecipients = subscribers.map(subscriber => subscriber.personalEmail);
        const batchSize = 50;
        
        // Send emails in batches
        for (let i = 0; i < bccRecipients.length; i += batchSize) {
            const batch = bccRecipients.slice(i, i + batchSize);
            
            try {
                const emailContent = formEmailTemplate({
                    name: form.name,
                    desc: form.desc,
                    deadline: form.deadline,
                    formId: form._id,
                    createdBy: formCreator
                });
                 // Replace template placeholder with actual recipient name
                await sendEmail({
                    to: "noreply@nexus-svnit.in",
                    bcc: batch,
                    ...emailContent,
                    html: emailContent.html.replace('{{name}}', 'NEXUS Member')
                });
                
                console.log(`Sent batch ${Math.ceil(i/batchSize) + 1} with ${batch.length} recipients`);
            } catch (error) {
                console.error(`Error sending batch ${Math.ceil(i/batchSize) + 1}:`, error);
            }
        }

        // Send confirmation to admin with details
        await sendEmail({
            to: process.env.EMAIL_ID,
            cc: coreMember ? coreMember.email : undefined,
            subject: `Form Notification Sent: ${form.name}`,
            html: `
                <div style="background-color: black; color: white; font-size: 14px; padding: 20px;">
                    <div style="background-color: #333; padding: 20px; border-radius: 8px;">
                        <h2>Form Notification Summary</h2>
                        <p>Form <strong>${form.name}</strong> notification was sent to ${subscribers.length} subscribers.</p>
                        <p>Created by: ${formCreator}</p>
                        <p>Notification sent by: ${coreMember ? coreMember.email : 'Unknown'}</p>
                        <p>Sent on: ${new Date().toLocaleString()}</p>
                        <p><a href="https://docs.google.com/spreadsheets/d/${form.sheetId}" style="color: #1a73e8;">View Responses</a></p>
                    </div>
                </div>
            `
        });

        return res.status(200).json({ message: `Notification sent to ${subscribers.length} subscribers.` });
    } catch (error) {
        handleError(res, error);  
    }
};

// Export all controller functions
module.exports = {
    getPublicForms,
    submitResponse,
    getFormFields,     
    submitOpenResponse,
};
