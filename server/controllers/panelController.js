const mongoose = require('mongoose');
const Forms = mongoose.model('form');
const Panel = require("../models/PanelModel");
const nodemailer = require('nodemailer');
const moment = require('moment'); // Import moment for date formatting

// Create Panels and Assign Candidates
exports.createPanels = async (req, res) => {
    const { formId, panels } = req.body;

    try {
        const form = await Forms.findById(formId);
        
        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        let candidateIndex = 0;

        for (let panel of panels) {
            const {
                panelNumber,
                interviewers,
                candidatesPerPanel,
                panelLink,
                interviewTimes
            } = panel;

            const candidatesForPanel = form.responses.slice(candidateIndex, candidateIndex + candidatesPerPanel);
            candidateIndex += candidatesPerPanel;

            let existingPanel = await Panel.findOne({ panelNumber, form: formId });

            if (!existingPanel) {
                const newPanel = new Panel({
                    panelNumber,
                    interviewers,
                    candidates: candidatesForPanel.map((candidate, index) => ({
                        email: candidate.Email,
                        interviewTime: interviewTimes[index]
                    })),
                    startTime: panel.startTime,
                    interviewDuration: panel.interviewDuration,
                    panelLink,
                    form: formId,
                    emailsSent: {
                        interviewers: [],
                        candidates: []
                    }
                });
                await newPanel.save();
                existingPanel = newPanel;
            }

            // Sending emails to interviewers
            for (let interviewer of interviewers) {
                if (!existingPanel.emailsSent.interviewers.includes(interviewer.email)) {
                    console.log(`Sending email to interviewer: ${interviewer.email}`);
                    await sendEmail({
                        to: interviewer.email,
                        subject: `Interview Panel ${panelNumber}`,
                        text: `Dear ${interviewer.name},\n\nYou have been assigned to Panel ${panelNumber}. The interview panel link is ${panelLink}. Please find your schedule below:\n\n${interviewTimes.map((time, index) => {
                            const formattedTime = moment(time).format('YYYY-MM-DD HH:mm:ss');
                            return `Candidate ${index + 1}: ${formattedTime}`;
                        }).join('\n')}\n\nBest Regards,\nThe Team Nexus`
                    });

                    existingPanel.emailsSent.interviewers.push(interviewer.email);
                }
            }

            // Sending emails to candidates
            for (let i = 0; i < candidatesForPanel.length; i++) {
                const candidateEmail = candidatesForPanel[i].Email;
                if (!candidateEmail) {
                    console.error(`No email found for candidate: ${candidatesForPanel[i].FullName}`);
                    continue;
                }

                if (!existingPanel.emailsSent.candidates.includes(candidateEmail)) {
                    console.log(`Sending email to candidate: ${candidateEmail}`);
                    await sendEmail({
                        to: candidateEmail,
                        subject: `Interview Scheduled for Panel ${panelNumber}`,
                        text: `Dear ${candidatesForPanel[i].FullName},\n\nYour interview has been scheduled with Panel ${panelNumber}. The interview panel link is ${panelLink}. Your interview time is ${moment(interviewTimes[i]).format('YYYY-MM-DD HH:mm:ss')}.\n\nBest Regards,\nThe Team Nexus`
                    });

                    existingPanel.emailsSent.candidates.push(candidateEmail);
                }
            }

            await existingPanel.save();
        }

        res.status(200).json({ message: 'Panels created and emails sent successfully!' });
    } catch (error) {
        console.error('Error creating panels:', error);
        res.status(500).json({ error: 'Error creating panels' });
    }
};

// Pagination for Form Responses
exports.getFormResponses = async (req, res) => {
    const { formId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const form = await Forms.findById(formId);
        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        const totalResponses = form.responses.length;
        if ((page - 1) * limit >= totalResponses) {
            return res.status(404).json({ error: 'Page exceeds total number of responses' });
        }

        const responses = form.responses.slice((page - 1) * limit, page * limit);

        res.status(200).json({
            responses,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalResponses / limit),
            totalResponses
        });
    } catch (error) {
        console.error('Error fetching form responses:', error);
        res.status(500).json({ error: 'Error fetching form responses' });
    }
};

// Helper function to send email
const sendEmail = async ({ to, subject, text }) => {
    try {
        if (!to) {
            console.error('No recipient defined');
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_ID,
            to,
            subject,
            text
        });

        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
