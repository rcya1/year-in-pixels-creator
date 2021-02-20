const mongoose = require('mongoose');
const validate = require('./validate');

const colorSchemeSchema = new mongoose.Schema({
        red: {
            type: Number,
            required: true,
            validate: [validate.validateColorValue, "Red value must be in the range [0, 255]"]
        },
        green: {
            type: Number,
            required: true,
            validate: [validate.validateColorValue, "Red value must be in the range [0, 255]"]
        },
        blue: {
            type: Number,
            required: true,
            validate: [validate.validateColorValue, "Red value must be in the range [0, 255]"]
        },
        label: {
            type: String,
            required: true,
            validate: [validate.validateNonZeroLength, "Label must have a length > 0"]
        },
        ordering: {
            type: Number,
            required: true
        }
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('ColorScheme', colorSchemeSchema);
