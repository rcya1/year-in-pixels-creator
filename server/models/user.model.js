const mongoose = require('mongoose');
const colorSchemeSchema = require('./color_scheme.model');
const dataSchema = require('./data.model');

const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
        },
        passwordHash: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        },
        userToken: {
            type: String,
            required: true
        },
        colorSchemes: {
            type: [colorSchemeSchema],
            required: false
        },
        data: {
            type: [dataSchema],
            required: true
        }
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);
