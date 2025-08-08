const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const teamMembersModel = require('../models/teamMembersModel');
const bcrypt = require('bcrypt')


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await teamMembersModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Compare password using bcrypt
        const bcrypt = require('bcrypt');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
           id: user._id,
           isAdmin : true
        };

        const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const verify = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET); // Use your secret key here
        if(!decoded.isAdmin) 
            return res.status(200).json({ success: false, message: 'Unauthorised Access' });
        const user = await teamMembersModel.findById(decoded.id);
        if(!user) 
            return res.status(200).json({ success: false, message: 'Unauthorised Access' });
        
        return res.status(200).json({ success: true, message: 'OK' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: 'Error Occured' });
    }
};


module.exports = {
    loginUser, verify
};