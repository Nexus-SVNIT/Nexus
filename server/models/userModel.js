const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.statics.signup = async function (email, password) {

    // validating email and password
    if(!email || !password)
        throw Error('All fields are mandatory');
    if(!validator.isEmail(email))
        throw Error('Entered email is not a valid email');
    if(!validator.isStrongPassword(password))
        throw Error('Password is not strong enough');
    
    // checking for uniqueness of email
    const exists = await this.findOne({ email });
    if (exists)
        throw Error('Email already exists');
    
    // if email is unique hash the password and create the user
    const salt = await bcrypt.genSalt(10);
    const hashPswd = await bcrypt.hash(password, salt);
    const user = await this.create({ email, password: hashPswd });
    return user;
}

userSchema.statics.login = async function(email,password){
    if(!email || !password)
        throw Error('All fields are mandatory');
    const user = await this.findOne({ email });
    if (!user)
        throw Error('Incorrect email');
    const match = await bcrypt.compare(password, user.password);
    if(!match)
        throw Error('Incorrect password');
    return user;
}
module.exports = mongoose.model('user', userSchema);