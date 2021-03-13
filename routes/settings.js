const router = require('express').Router();
let UserSchema = require('../models/user.model');
let SettingsSchema = require('../models/color_scheme.model');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
let {log, Status} = require('./route_logger');


/**
 * GET
 * Returns an object containing all of the settings for the current user
 */
 router.route('/').get(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    let user = await UserSchema.findById(req.user._id)
        .populate("settings");
    res.json(user.settings);
}));

/**
 * GET
 * Retrieves the value of a specific setting
 */
 router.route('/:setting').put(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    let user = await UserSchema.findById(req.user._id)
        .populate("settings");
        
    res.json(user.settings.get(req.params.setting));
}));

/**
 * PUT
 * Updates the setting with a new value
 * 
 * Body Content Required:
 *  newValue: String containing new value
 */
router.route('/:setting').put(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    let user = await UserSchema.findById(req.user._id)
        .populate("settings");

    user.settings.set(req.params.settings, req.body.newValue);
    await user.settings.save();

    log(res, Status.SUCCESS, "Updated settings.");
}));

module.exports = router;
