const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const validate = require('./validate');

const userSchema = new mongoose.Schema({
        username: {
            type: String,
            validate: [validate.validateNonZeroLength, "Username must have length > 0"]
        },
        password: {
            type: String,
            validate: [validate.validateNonZeroLength, "Password must have length > 0"]
        },
        name: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false,
            unique: true,
            validate: [validate.validateEmail, "Invalid email address"]
        },
        emailVerificationToken: {
            type: String,
            required: false,
            unique: false
        },
        emailVerificationTokenDate: {
            type: Date,
            required: false
        },
        emailVerified: {
            type: Boolean,
            required: true,
            default: false
        },
        passwordResetToken: {
            type: String,
            required: false,
            unique: false
        },
        passwordResetTokenDate: {
            type: Date,
            required: false
        },
        colorSchemes: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ColorScheme'
            }],
            required: true
        },
        data: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Data'
            }],
            required: true
        },
        settings: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Settings'
        }
    }, {
        timestamps: true
    }
);

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
