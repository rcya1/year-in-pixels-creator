const router = require('express').Router();
let UserSchema = require('../models/user.model');
let ColorSchemeSchema = require('../models/color_scheme.model');
let DataSchema = require('../models/data.model');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
let {log, Status} = require('./route_logger');

/**
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
 * Deletes the user that is currently logged in
 * 
 * No Body Content Required
 */
router.route('/delete').post(passport.authenticate('local'), asyncHandler(async(req, res) => {
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
 * Returns all of the user data in JSON for the currently logged in user
 * 
 * No Body Content Required
 */
router.route('/get').get(passport.authenticate('local'), asyncHandler(async(req, res) => {
    let user = await UserSchema.findById(req.user._id)
        .populate("colorSchemes")
        .populate("data");
    res.json(user);
}));

module.exports = router;
