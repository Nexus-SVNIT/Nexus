const mongoose = require('mongoose');
const Forms = mongoose.model('form');
const User = require('../models/userModel.js'); // Adjust the path as necessary
const { sendEmail } = require('../utils/emailUtils.js'); // Adjust the path to your nodemailer utility
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { Readable } = require('stream');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const credentials = {
    type: process.env.GOOGLE_CLOUD_TYPE,
    project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
    private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
    auth_uri: process.env.GOOGLE_CLOUD_AUTH_URI,
    token_uri: process.env.GOOGLE_CLOUD_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL,
    universe_domain: process.env.GOOGLE_CLOUD_UNIVERSE_DOMAIN
};

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

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
                    <tr><td>Link to apply:</td><td><a href="${linkToApply}">Apply Now</a></td></tr>
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
        if (!deadline || !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
            return res.status(400).json({ success: false, message: 'Invalid deadline format. Expected format: YYYY-MM-DD' });
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

async function createDriveFolder(formTitle) {
    const folderName = `${formTitle} - ${new Date().toLocaleDateString()}`;
    const fileMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [process.env.GOOGLE_DRIVE_FORMS_FOLDER_ID], // ID of the main folder in Drive
    };

    try {
        const response = await drive.files.create({
            resource: fileMetadata,
            fields: "id",
        });
        return response.data.id; // Returns the subfolder ID
    } catch (error) {
        console.error("Error creating Drive folder:", error);
        throw new Error("Failed to create folder in Google Drive");
    }
}


const createForm = async (req, res) => {
    const {
        name,
        desc,
        deadline,
        formFields,
        WaLink,
        enableTeams,
        teamSize,
        fileUploadEnabled,
        receivePayment,
        amount,
        qrCodeUrl,
        Payments
    } = req.body;
    
    const _event = "none";  // Default value for _event if not provided
    let driveFolderId = null;

    // If file upload is enabled, create a subfolder on Google Drive
    if (fileUploadEnabled) {
        try {
            driveFolderId = await createDriveFolder(name); // Create folder and get folder ID
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to create folder in Google Drive" });
        }
    }

    // Default values
    const created_date = new Date().toISOString();
    const publish = false;

    // Validate team size if enableTeams is true
    let teamData = {};
    if (enableTeams) {
        if (!teamSize || teamSize <= 0) {
            return res.status(400).json({ error: "Invalid team size. It should be a positive integer." });
        }
        teamData = { enableTeams, teamSize };
    }

    try {
        const createdForm = await Forms.create({
            name,
            desc,
            deadline,
            created_date,
            publish,
            formFields,
            WaLink,
            _event,
            ...teamData, // Spread the team data if teams are enabled
            fileUploadEnabled,
            driveFolderId,
            receivePayment,
            amount,
            qrCodeUrl,
            Payments
        });

        res.status(200).json({ success: true, form: createdForm });
    } catch (err) {
        handleError(res, err);
    }
};


const uploadImageToDrive = async (req, driveFolderId, admissionNumber) => {
    try {
        if (!req.file) {
            return { success: false, error: 'No file uploaded.' };
        }

        const fileMetadata = {
            name: admissionNumber || req.file.originalname,
            parents: [driveFolderId || process.env.GOOGLE_DRIVE_FORMS_FOLDER_ID]
        };

        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null);

        const media = {
            mimeType: req.file.mimetype,
            body: bufferStream,
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        return { success: true, fileId: file.data.id };
    } catch (error) {
        console.log('Error uploading file:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
};

const submitResponse = async (req, res) => {
    const formId = req.params.id;
    const admissionNumber = req.user?.admissionNumber;

    try {
        // Retrieve form details
        const formDetails = await Forms.findById(formId);
        if (!formDetails) {
            return res.status(404).json({ success: false, message: "Form not found." });
        }

        // Check if the deadline has passed
        const deadlineDate = new Date(formDetails.deadline).getTime();
        const currentDate = Date.now();
        if (deadlineDate < currentDate) {
            return res.status(400).json({
                success: false,
                message: "The deadline has passed. Your response was not saved.",
            });
        }

        // Check if the user has already submitted the form
        const existingResponse = await Forms.findOne({
            _id: formId,
            "responses.admissionNumber": admissionNumber,
        });
<<<<<<< HEAD


        if (!existingForm && formDetails.enableTeams) {
            const teamMembers  = JSON.parse(req.body.teamMembers);
            req.body.teamMembers = teamMembers;
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

                const existingMember = await User.findOne({ admissionNumber });
                if (!existingMember) {
                    return res.status(400).json({
                        success: false,
                        message: `Team member with admission number ${admissionNumber} does not exist.`,
                    });
                }


            }
        }

        if (existingForm) {
            return res.status(400).json({
=======
        if (existingResponse) {
            return res.status(200).json({
>>>>>>> 5c3ac612ea74151f5316a979aabfbcf429aea0eb
                success: false,
                message: "You have already registered.",
            });
        }

        // Handle team requirements if teams are enabled
        if (formDetails.enableTeams) {
            const { teamName, teamMembers } = req.body;
            const parsedTeamMembers = teamMembers ? JSON.parse(teamMembers) : [];

            // Validate teamName and teamMembers
            if (!teamName || parsedTeamMembers.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Team name and team members are required."
                });
            }

            // Check if the team name is already registered
            const existingTeam = await Forms.findOne({
                _id: formId,
                "responses.teamName": teamName,
            });
            if (existingTeam) {
                return res.status(400).json({
                    success: false,
                    message: "Team name already exists.",
                });
            }

            // Verify each team member's registration status and existence
            const teamChecks = await Promise.all(
                parsedTeamMembers.map(async (memberAdmissionNumber) => {
                    const [existingMemberForm, existingMember] = await Promise.all([
                        Forms.findOne({
                            _id: formId,
                            "responses.teamMembers": memberAdmissionNumber,
                        }),
                        User.findOne({ admissionNumber: memberAdmissionNumber }),
                    ]);

                    if (existingMemberForm) {
                        return `Team member with admission number ${memberAdmissionNumber} has already registered.`;
                    }
                    if (!existingMember) {
                        return `Team member with admission number ${memberAdmissionNumber} does not exist.`;
                    }
                    return null;
                })
            );

            const teamErrors = teamChecks.filter((msg) => msg !== null);
            if (teamErrors.length > 0) {
                return res.status(200).json({
                    success: false,
                    message: teamErrors.join(" "),
                });
            }

            req.body.teamMembers = parsedTeamMembers; // Add parsed members to request body
        }

        // Payment validation if required
        if (formDetails.receivePayment) {
            console.log(formDetails);
            const { paymentId, screenshotUrl } = req.body.payments;

            // Check if paymentId and screenshotUrl are provided
            if (!paymentId || !screenshotUrl) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Payment ID and screenshot URL are required for this form." 
                });
            }

            // Ensure unique paymentId in payments array
            const existingPayment = formDetails.payments.find(payment => payment.paymentId === paymentId);
            if (existingPayment) {
                return res.status(200).json({
                    success: false,
                    message: "This payment ID has already been used.",
                });
            }

            // Add payment details to request body for tracking
            req.body.paymentDetails = {
                paymentId,
                screenshotUrl,
                paymentStatus: "Pending"
            };
        }

        // Upload file to Google Drive if file upload is enabled
        if (formDetails.fileUploadEnabled) {
            const uploadResult = await uploadImageToDrive(req, formDetails.driveFolderId, admissionNumber);
            if (!uploadResult.success) {
                return res.status(500).json({ success: false, message: `Error uploading file: ${uploadResult.error}` });
            }
            req.body.files = uploadResult.fileId; // Set uploaded file ID in request body
        }

        // Create response with the payment details and save it to the form
        const response = {
            ...req.body,
            admissionNumber,
            ...(formDetails.receivePayment ? { payments: [req.body.paymentDetails] } : {})
        };

        const updatedForm = await Forms.findByIdAndUpdate(
            formId,
            { $push: { responses: response, ...(formDetails.receivePayment ? { payments: req.body.paymentDetails } : {}) } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Your response has been successfully saved.",
            WaLink: updatedForm?.WaLink || "Default link", // Handle missing WaLink gracefully
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An error occurred while submitting the response. Please try again later."
        });
    }
};



const getResponses = async (req, res) => {
    const id = req.params.id;
    try {
        // Fetch responses along with user details by admissionNumber
        const form = await Forms.findById(id).select({ responses: true, enableTeams: true, _id: false });

        if (!form) throw new Error("Form not found");

        const responseWithUserDetails = await Promise.all(
            !form.enableTeams
                ? form.responses.map(async (response) => {
                    const user = await User.findOne({ admissionNumber: response.admissionNumber }, { password: false, shareCodingProfile: false, subscribed: false, emailVerified: false }).lean();
                    return {
                        ...response,
                        user: user || null,
                    };
                })
                : form.responses.map(async (response) => {
                    const teamMemberDetails = await Promise.all(
                        response.teamMembers.map(async (teamMember) => {
                            const user = await User.findOne({ admissionNumber: teamMember }).lean();
                            return user || null;
                        })
                    );
                    return {
                        ...response,
                        teamLeader: response.admissionNumber,
                        admissionNumber: undefined,
                        teamMembers: teamMemberDetails,
                    };
                })
        );


        res.status(200).json({ responses: responseWithUserDetails, enableTeams: form.enableTeams });
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
