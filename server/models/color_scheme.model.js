const mongoose = require('mongoose');

const colorSchemeSchema = new mongoose.Schema({
        red: {
            type: Number,
            required: true
        },
        green: {
            type: Number,
            required: true
        },
        blue: {
            type: Number,
            required: true
        },
        label: {
            type: String,
            required: true
        }
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('ColorScheme', colorSchemeSchema);
