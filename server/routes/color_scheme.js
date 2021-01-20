const router = require('express').Router();
let UserSchema = require('../models/user.model');
let ColorSchemeSchema = require('../models/color_scheme.model');
let DataSchema = require('../models/data.model');
const passport = require('passport');

// TODO Paths for deleting, adding, and editing color schemes

router.route('/get').get((req, res, next) => {
    if(!req.isAuthenticated()) {
        return res.send("Error: The user is not logged in");
    }

    UserSchema.findById(req.user._id)
        .populate('colorSchemes')
        .then(user => res.json(user.colorSchemes))
        .catch(err => res.status(400).send("Could not find that user: " + err));
});

module.exports = router;
