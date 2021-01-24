const router = require('express').Router();
let UserSchema = require('../models/user.model');
let ColorSchemeSchema = require('../models/color_scheme.model');
let DataSchema = require('../models/data.model');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
let {log, Status} = require('./route_logger');

router.route('/get').get(passport.authenticate('local'), asyncHandler(async(req, res) => {
    let user = await UserSchema.findById(req.user._id)
        .populate('colorSchemes');
    res.json(user.colorSchemes);
}));

router.route('/add').post(passport.authenticate('local'), asyncHandler(async(req, res) => {    
    // check if this color scheme label already exists
    let user = await UserSchema.findById(req.user._id)
        .populate('colorSchemes');
    
    for(let colorScheme of user.colorSchemes) {
        if(colorScheme.label == req.body.label) {
            log(res, Status.ERROR, "Color scheme with that label already exists.");
            return;
        }
    }

    const newColorScheme = {
        red: Number(req.body.red),
        green: Number(req.body.green),
        blue: Number(req.body.blue),
        label: req.body.label
    };
    let colorScheme = new ColorSchemeSchema(newColorScheme);
    await colorScheme.save();

    user.colorSchemes.push(colorScheme._id);
    await user.save();
    log(res, Status.SUCCESS, "Added color scheme to user.");
}));

router.route('/edit').post(passport.authenticate('local'), asyncHandler(async(req, res) => {
    let user = await UserSchema.findById(req.user._id)
        .populate('colorSchemes');

    let found = false;
    for(let colorScheme of user.colorSchemes) {
        if(colorScheme._id == req.body.colorSchemeId) {
            found = true;
            break;
        }
    }

    if(!found) {
        log(res, Status.ERROR, "Could not find color scheme with that id in the current user.");
    }

    let colorScheme = await ColorSchemeSchema.findById(req.body.colorSchemeId);
    colorScheme.red   = req.body.red;
    colorScheme.green = req.body.green;
    colorScheme.blue  = req.body.blue;
    colorScheme.label = req.body.label;
    await colorScheme.save();

    log(res, Status.SUCCESS, "Edited color scheme.");
}));

router.route('/delete').post(passport.authenticate('local'), asyncHandler(async(req, res) => {
    let user = await UserSchema.findById(req.user._id)
        .populate('colorSchemes');

    let found = false;
    for(let i in user.colorSchemes) {
        let colorScheme = user.colorSchemes[i];
        if(colorScheme._id == req.body.colorSchemeId) {
            found = true;
            user.colorSchemes.splice(i, 1);
            await user.save();
            break;
        }
    }

    if(!found) log(res, Status.ERROR, "Could not find color scheme of that ID in the current user.");

    await ColorSchemeSchema.findByIdAndDelete(req.body.colorSchemeId);
    log(res, Status.SUCCESS, "Color scheme deleted.");
}));

module.exports = router;
