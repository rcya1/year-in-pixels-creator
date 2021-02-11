const router = require('express').Router();
let UserSchema = require('../models/user.model');
let DataSchema = require('../models/data.model');
const asyncHandler = require('express-async-handler');
let {log, Status} = require('./route_logger');

/**
 * Returns an array of JSON objects with all of the color/comments data for the currently logged in user
 */
router.route('/get').get(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    let user = await UserSchema.findById(req.user._id)
        .populate('data');
    res.json(user.data);
}));
/**
 * Returns a JSON object with all of the color/comments data for a speciic year for the currently logged in user
 */
router.route('/get-year/:year').get(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    let user = await UserSchema.findById(req.user._id)
        .populate('data');
    for(let dataId of user.data) {
        let data = await DataSchema.findById(dataId);
        if(data.year == req.params.year) {
            res.json(data);
            return;
        }
    }
    
    log(res, Status.ERROR, "Could not find that year in the current user");
}));

/**
 * Returns an array of the color values for a specific year for the currently logged in user
 */
router.route('/get-year-values/:year').get(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    let user = await UserSchema.findById(req.user._id)
        .populate('data');
    for(let dataId of user.data) {
        let data = await DataSchema.findById(dataId);
        if(data.year == req.params.year) {
            res.json(data.values);
            return;
        }
    }

    log(res, Status.ERROR, "Could not find that year in the current user");
}));

/**
 * Returns an array of the comment data for a specific year for the currently logged in user
 */
router.route('/get-year-comments/:year').get(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    let user = await UserSchema.findById(req.user._id)
        .populate('data');
    for(let dataId of user.data) {
        let data = await DataSchema.findById(dataId);
        if(data.year == req.params.year) {
            res.json(data.comments);
            return;
        }
    }

    log(res, Status.ERROR, "Could not find that year in the current user");
}));

/**
 * Returns a JSON with the color/comments data for a specific date for the currently logged in user
 */
router.route('/get-day/:year/:month/:day').get(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    if(!validateDate(res, req.params.month, req.params.day)) return;

    let user = await UserSchema.findById(req.user._id)
        .populate('data');
    for(let dataId of user.data) {
        let data = await DataSchema.findById(dataId);
        if(data.year == req.params.year) {
            let index = (req.params.month - 1) * 12 + req.params.day - 1;
            let value = data.values[index];
            let comment = data.comments[index];
            res.json({
                value: value,
                comment: comment
            });
            return;
        }
    }

    log(res, Status.ERROR, "Could not find that year in the current user");
}));

/**
 * Returns the color value for a specific date for the currently logged in user
 */
router.route('/get-day-value/:year/:month/:day').get(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    if(!validateDate(res, req.params.month, req.params.day)) return;
    
    let user = await UserSchema.findById(req.user._id)
        .populate('data');
    for(let dataId of user.data) {
        let data = await DataSchema.findById(dataId);
        if(data.year == req.params.year) {
            let index = (req.params.month - 1) * 12 + req.params.day - 1;
            let value = data.values[index];
            res.json(value);
            return;
        }
    }

    log(res, Status.ERROR, "Could not find that year in the current user");
}));

/**
 * Returns the comment for a specific date for the currently logged in user
 */
router.route('/get-day-comment/:year/:month/:day').get(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    if(!validateDate(res, req.params.month, req.params.day)) return;

    let user = await UserSchema.findById(req.user._id)
        .populate('data');
    for(let dataId of user.data) {
        let data = await DataSchema.findById(dataId);
        if(data.year == req.params.year) {
            let index = (req.params.month - 1) * 12 + req.params.day - 1;
            let comment = data.comments[index];
            res.json(comment);
            return;
        }
    }

    log(res, Status.ERROR, "Could not find that year in the current user");
}));

/**
 * Edits the color value for a specific date for the currently logged in user
 * 
 * Body Content Required:
 *  year  - Number representing which year's data should be modified
 *  day   - Number (1-indexed) representing which day's data should be modified
 *  month - Number (1-indexed) representing which month's data should be modified
 *  value - Number representing the new color value for this date
 */
router.route('/edit-value').post(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    if(!validateDate(res, req.body.month, req.body.day)) return;

    let user = await UserSchema.findById(req.user._id)
        .populate('data');
    for(let dataId of user.data) {
        let data = await DataSchema.findById(dataId);
        if(data.year == req.body.year) {
            let index = (req.body.month - 1) * 12 + req.body.day - 1;
            data.values.set(index, req.body.value);

            await data.save();
            log(res, Status.SUCCESS, "Edited data.");
            
            return;
        }
    }

    log(res, Status.ERROR, "Could not find that year in the current user");
}));

/**
 * Edits the comment for a specific date for the currently logged in user
 * 
 * Body Content Required:
 *  year    - Number representing which year's data should be modified
 *  day     - Number (1-indexed) representing which day's data should be modified
 *  month   - Number (1-indexed) representing which month's data should be modified
 *  comment - String representing the new comment for this date
 */
router.route('/edit-comment').post(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    if(!validateDate(res, req.body.month, req.body.day)) return;

    let user = await UserSchema.findById(req.user._id)
        .populate('data');
    for(let dataId of user.data) {
        let data = await DataSchema.findById(dataId);
        if(data.year == req.body.year) {
            let index = (req.body.month - 1) * 12 + req.body.day - 1;
            data.comments.set(index, req.body.comment);
            return;
        }

        await data.save();
        log(res, Status.SUCCESS, "Edited comment.");
        return;
    }

    log(res, Status.ERROR, "Could not find that year in the current user");
}));

/**
 * Adds a new year for the currently logged in user
 * 
 * Body Content Required:
 *  year - Number representing which year should be added
 */
router.route('/add-year').post(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    let user = await UserSchema.findById(req.user._id)
        .populate('data');

    for(let data of user.data) {
        if(data.year == req.body.year) {
            log(res, Status.ERROR, "Data with that year already exists.");
            break;
        }
    }

    let values   = Array(12 * 31).fill(0);
    let comments = Array(12 * 31).fill("");

    const newData = {
        year: req.body.year,
        values: values,
        comments: comments,
    };
    let data = new DataSchema(newData);
    await data.save();

    user.data.push(data._id);
    await user.save();
    log(res, Status.SUCCESS, "Added data to user.");
}));

/**
 * Deletes a year for the currently logged in user
 * 
 * Body Content Required:
 *  year - Number representing which year should be deleted
 */
router.route('/delete-year').post(asyncHandler(async(req, res) => {
    if(!req.isAuthenticated()) {
        log(res, Status.ERROR, "User is not logged in");
        return;
    }

    let user = await UserSchema.findById(req.user._id)
        .populate('data');

    let id = -1;

    for(let i in user.data) {
        let data = user.data[i];
        if(data.year == req.body.year) {
            id = data._id;
            user.data.splice(i, 1);
            await user.save();
            break;
        }
    }

    if(id == -1) log(res, Status.ERROR, "Could not find data for that year in the current user.");

    await DataSchema.findByIdAndDelete(id);
    log(res, Status.SUCCESS, "Data deleted.");
}));

function validateDate(res, month, day) {
    if(month == undefined || day == undefined || month <= 0 || day <= 0 || month > 12 || day > 31) {
        log(res, Status.ERROR, "Date given is not valid");
        return false;
    }

    return true;
}

module.exports = router;
