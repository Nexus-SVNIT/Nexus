// models/coreMember.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

// Define the coreMember schema
const coreMemberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
});

// Pre-save hook to hash passwords
coreMemberSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare passwords
coreMemberSchema.methods.comparePassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const coreMember = mongoose.model('coreMember', coreMemberSchema);
module.exports = coreMember;
