const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
        year: {
            type: Number,
            required: true
        },
        values: {
            type: [Number],
            required: true,
            validate: [validateDataLength, "Size of values is not correct!"]
        },
        comments: {
            type: [String],
            required: true,
            validate: [validateDataLength, "Size of comments is not correct!"]
        }
    }, {
        timestamps: true
    }
);

function validateDataLength(arr) {
    return arr.length !== 12 * 31;
}

module.exports = mongoose.model('Data', dataSchema);
