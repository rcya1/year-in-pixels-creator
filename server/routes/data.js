const router = require('express').Router();
let UserSchema = require('../models/user.model');
let ColorSchemeSchema = require('../models/color_scheme.model');
let DataSchema = require('../models/data.model');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
let {log, Status} = require('./route_logger');

// TODO Add routes for accessing all years from a user, all values for a specific year, all comments for a specific year
// value for a specific date, comment for a specific date
// edit value for a specific date, edit comment for a specific date, delete year, add year

router.route('/get').get(passport.authenticate('local'), asyncHandler(async(req, res) => {
    let user = await UserSchema.findById(req.user._id)
        .populate('data');
    res.json(user.data);
}));

module.exports = router;
