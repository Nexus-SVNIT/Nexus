const member = require("../models/memberModel.js");

// Middleware for logging request details
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Move to the next middleware/route handler
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
};

const getAllMember = async (req, res, next) => {
    try {
        const getAllMemberDetails = await member.find();
        res.json(getAllMemberDetails);
    } catch (err) {
        next(err); // Pass the error to the error handler middleware
    }
};

const getUniqueMember = async (req, res, next) => {
    const id = req.params.id;
    try {
        const singleMember = await member.findById(id);
        if (!singleMember) {
            return res.status(404).json({ error: "Member not found" });
        }
        res.json(singleMember);
    } catch (err) {
        next(err); // Pass the error to the error handler middleware
    }
};

const deleteMember = async (req, res, next) => {
    const id = req.params.id;
    try {
        const singleMemberToDelete = await member.findByIdAndDelete(id);
        if (!singleMemberToDelete) {
            return res.status(404).json({ error: "Member not found" });
        }
        res.json(singleMemberToDelete);
    } catch (err) {
        next(err); // Pass the error to the error handler middleware
    }
};

const updateMemberDetails = async (req, res, next) => {
    const id = req.params.id;
    try {
        const updatedMember = await member.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMember) {
            return res.status(404).json({ error: "Member not found" });
        }
        res.status(200).json(updatedMember);
    } catch (err) {
        next(err); // Pass the error to the error handler middleware
    }
};

module.exports = {
    logRequest, // Middleware for logging
    errorHandler, // Error handling middleware
    getAllMember,
    getUniqueMember,
    updateMemberDetails,
    deleteMember
};
