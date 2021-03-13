const router = require('express').Router();
let UserSchema = require('../models/user.model');
let SettingsSchema = require('../models/settings.model');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
let {log, Status} = require('./route_logger');

/**
 * POST
 * Sets up a blank settings object
 */
 router.route('/').post(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    let settings = new SettingsSchema({});
    await settings.save();

    let user = await UserSchema.findById(req.user._id);
    user.settings = settings._id;
    await user.save();

    log(res, Status.SUCCESS, "Created blank settings object.");
}));

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
 * If a setting is not already in, then it will return ""
 */
 router.route('/:setting').get(asyncHandler(async(req, res) => {
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

    user.settings.set(req.params.setting, req.body.newValue);
    await user.settings.save();

    log(res, Status.SUCCESS, "Updated settings.");
}));

module.exports = router;
