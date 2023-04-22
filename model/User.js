const mongoose = require('mongoose');
const jwtWebToken = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please, provide a name.'],
        maxLength: 50,
        minLength: 3,
    },
    email: {
        type: String,
        required: [true, 'Please, provide a email.'],
        unique: true,
        maxLength: 100,
        minLength: 3,
        validate: validator.isEmail,
        message: 'Please, provide a valid email.',
    },
    password: {
        type: String,
        required: [true, 'Please, provide a password'],
        maxLength: 200,
        minLength: 3,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    }
});

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.checkPassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model('User', UserSchema);