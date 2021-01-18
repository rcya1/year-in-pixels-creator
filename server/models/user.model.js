const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const colorSchemeSchema = require('./color_scheme.model');
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
        }
    }, {
        timestamps: true
    }
);

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
