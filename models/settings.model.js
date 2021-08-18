const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
        showTodayMarker: {
            type: String
        },
        invalidCellsDisplayType: {
            type: String
        },
        boardDisplayType: {
            type: String
        },
        showDayNumber: {
            type: Boolean
        }
    }, {
        timestamps: false
    }
);

module.exports = mongoose.model('Settings', settingsSchema);
