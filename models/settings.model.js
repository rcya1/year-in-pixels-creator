const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
        showTodayMarker: {
            type: String,
            required: true
        },
        invalidCellsDisplayType: {
            type: String,
            required: true
        }
    }, {
        timestamps: false
    }
);

module.exports = mongoose.model('Settings', settingsSchema);
