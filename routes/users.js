const router = require('express').Router();
let UserSchema = require('../models/user.model');
let ColorSchemeSchema = require('../models/color_scheme.model');
let DataSchema = require('../models/data.model');
let SettingsSchema = require('../models/settings.model');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
let {log, Status} = require('./route_logger');

/**
 * GET
 * Returns all of the user data in JSON for the currently logged in user
 */
router.route('/').get(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    let user = await UserSchema.findById(req.user._id);
    res.json(user);
}));

/**
 * GET
 * Returns all of the user data in JSON for the currently logged in user
 * with all variables populated
 */
 router.route('/full-data').get(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    let user = await UserSchema.findById(req.user._id)
        .populate("colorSchemes")
        .populate("data")
        .populate("settings");
    res.json(user);
}));

/**
 * PUT
 * Updates the current user's name and username
 * 
 * Body Content Required
 *  username - username
 *  name     - name
 */
router.route('/').put(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    let username = req.body.username;
    let name     = req.body.name;
    
    let user = await UserSchema.findById(req.user._id);

    user.username = username;
    user.name = name;
    await user.save();
    
    log(res, Status.SUCCESS, "User updated.");
}));

/**
 * DELETE
 * Delete the current user's account
 */
router.route('/').delete(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    let user = await UserSchema.findById(req.user._id);
    req.logOut();
    
    for(let colorSchemeID of user.colorSchemes) {
        await ColorSchemeSchema.findByIdAndDelete(colorSchemeID);
    }
    for(let dataID of user.data) {
        await DataSchema.findByIdAndDelete(dataID);
    }
    await SettingsSchema.findByIdAndDelete(user.settings);
    await user.delete();
    
    log(res, Status.SUCCESS, "User deleted.");
}));

/**
 * POST
 * Changes the user's password
 * 
 * Body Content Required
 *  oldPassword - original password before changing
 *  newPassword - new password after changing
 */
router.route('/change-password').post(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }
    
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    user = await UserSchema.findById(req.user._id);

    await user.changePassword(oldPassword, newPassword);

    log(res, Status.SUCCESS, "Password updated.");
}));

/**
 * DELETE
 * Deletes the user that is currently logged in
 * 
 * No Body Content Required
 */
router.route('/').delete(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    let id = req.user._id;

    req.logOut();

    let user = await UserSchema.findById(id);

    let deleteRequests = [];

    for(let colorSchemeID of user.colorSchemes) {
        deleteRequests.push(ColorSchemeSchema.findByIdAndDelete(colorSchemeID));
    }
    for(let dataID of user.data) {
        deleteRequests.push(DataSchema.findByIdAndDelete(dataID));
    }

    await Promise.all(deleteRequests);
    await UserSchema.findByIdAndDelete(id);
    
    log(res, Status.SUCCESS, "User deleted.");
}));

/**
 * POST
 * Registers the given credentials with the application
 * 
 * Body Content Required:
 *  username - username
 *  password - password
 *  name - name
 */
router.route('/register').post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;

    const newUser = {
        username: username,
        name: name,
        colorSchemes: [],
        data: []
    };

    UserSchema.register(new UserSchema(newUser), password, (err) => {
        if(err) {
            log(res, Status.ERROR, err);
            return;
        }

        passport.authenticate('local')(req, res, function() {
            log(res, Status.SUCCESS, "Successfully added the user.");
        });
    });
});

/**
 * GET
 * Returns whether the given username is available
 */
router.route('/check-available/:username').get(asyncHandler(async(req, res) => {
    let exists = await UserSchema.exists({
        username: req.params.username
    });

    res.json(!exists);
}));

module.exports = router;
