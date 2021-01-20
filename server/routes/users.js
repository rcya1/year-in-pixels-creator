const router = require('express').Router();
let UserSchema = require('../models/user.model');
let ColorSchemeSchema = require('../models/color_scheme.model');
let DataSchema = require('../models/data.model');
const passport = require('passport');

router.route('/register').post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // ------------ TEMP ------------
    const newColorScheme = {
        red: 120,
        green: 120,
        blue: 120,
        label: "Test"
    };

    let colorScheme = new ColorSchemeSchema(newColorScheme);
    colorScheme.save();
    // ------------ TEMP ------------

    const newUser = {
        username: username,
        colorSchemes: [colorScheme._id],
        data: []
    };

    UserSchema.register(new UserSchema(newUser), password, (err, user) => {
        if(err) {
            return res.send("Unable to register user: " + err);
        }

        passport.authenticate('local')(req, res, function() {
            res.send("Successfully added the user " + user.username + ".");
        });
    });
});

router.route('/delete').post((req, res) => {
    if(!req.isAuthenticated()) {
        return res.send("Error: The user is not logged in");
    }

    let id = req.user._id;

    req.logOut();

    let message = "";

    // deep delete the data
    // TODO Combine delete and deep delete into a single call
    UserSchema.findById(id)
        .then(user => {
            for(let colorSchemeID of user.colorSchemes) {
                ColorSchemeSchema.findByIdAndDelete(colorSchemeID)
                    .then(colorScheme => message += "Color scheme " + colorScheme.label + " deleted\n")
                    .catch(err => res.status(400).json("Error: " + err));
            }
            for(let dataID of user.data) {
                DataSchema.findByIdAndDelete(dataID)
                    .then(data => message += "Data for " + data.year + " deleted\n")
                    .catch(err => res.status(400).json("Error: " + err));
            }
        })
        .catch(err => res.status(400).json("Error: " + err));
    
    UserSchema.findByIdAndDelete(id)
        .then(user => res.send(message + "User " + user.username + " deleted"))
        .catch(err => res.status(400).json("Error: " + err));
});

router.route('/get').get((req, res, next) => {
    if(!req.isAuthenticated()) {
        return res.send("Error: The user is not logged in");
    }

    UserSchema.findById(req.user._id)
        .populate("colorSchemes")
        .populate("data")
        .then(user => res.json(user))
        .catch(err => res.status(400).send("Could not find that user: " + err));
});

module.exports = router;
