const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const user = require('../models/userModel.js');

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '3d' });
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const currentUser = await user.login(email, password)
        const token = createToken(currentUser._id);
        res.status(200).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const signupUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const createdUser = await user.signup(email, password);
        const token = createToken(createdUser._id);
        res.status(200).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { loginUser, signupUser };