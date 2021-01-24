const router = require('express').Router();
let UserSchema = require('../models/user.model');
let ColorSchemeSchema = require('../models/color_scheme.model');
let DataSchema = require('../models/data.model');
const passport = require('passport');

router.route('/get').get((req, res, next) => {
    if(!req.isAuthenticated()) {
        return res.send("Error: The user is not logged in");
    }

    UserSchema.findById(req.user._id)
        .populate('colorSchemes')
        .then(user => res.json(user.colorSchemes))
        .catch(err => res.status(400).send("Error: Could not find that user: " + err));
});

router.route('/add').post((req, res, next) => {
    if(!req.isAuthenticated()) {
        return res.send("Error: The user is not logged in");
    }
    
    // check if this color scheme label already exists
    UserSchema.findById(req.user._id)
        .populate('colorSchemes')
        .then(user => {
            for(let i in user.colorSchemes) {
                let colorScheme = user.colorSchemes[i];
                if(colorScheme.label == req.body.label) {
                    return res.send("Error: Color scheme with that label already exists in the user.");
                }
            }
            
            const newColorScheme = {
                red: Number(req.body.red),
                green: Number(req.body.green),
                blue: Number(req.body.blue),
                label: req.body.label
            };

            let colorScheme = new ColorSchemeSchema(newColorScheme);
            colorScheme.save()
                .then(() => {
                    UserSchema.findById(req.user._id)
                        .then(user => {
                            user.colorSchemes.push(colorScheme._id);
                            user.save();
                            return res.send("Added color scheme to user.");
                        })
                        .catch(() => res.status(400).send("Error: Could not find user"));
                })
                .catch(() => res.status(400).send("Error: Could not save color scheme"));
        })
        .catch((err) => res.status(400).send("Error: Could not find user: " + err));
});

router.route('/edit').post((req, res, next) => {
    if(!req.isAuthenticated()) {
        return res.send("Error: The user is not logged in");
    }

    UserSchema.findById(req.user._id)
        .populate('colorSchemes')
        .then(user => {
            let found = false;

            for(let i in user.colorSchemes) {
                let colorScheme = user.colorSchemes[i];
                if(colorScheme._id == req.body.colorSchemeId) {
                    found = true;
                    break;
                }
            }

            if(!found) {
                return res.send("Error: Could not find color scheme of that ID in the user " + user.username);
            }

            ColorSchemeSchema.findById(req.body.colorSchemeId)
                .then(colorScheme => {
                    colorScheme.red   = req.body.red;
                    colorScheme.green = req.body.green;
                    colorScheme.blue  = req.body.blue;
                    colorScheme.label = req.body.label;

                    colorScheme.save()
                        .then(() => res.send("Successfully edited color scheme."))
                        .catch(err => res.status(400).send('Error: Could not save updated color scheme: ' + err));
                })
                .catch(err => res.status(400).send("Error with editing color scheme: " + err));
        })
        .catch(err => res.status(400).send("Error: Could not find that user: " + err));
});

router.route('/delete').post((req, res, next) => {
    if(!req.isAuthenticated()) {
        return res.send("Error: The user is not logged in");
    }

    UserSchema.findById(req.user._id)
        .populate('colorSchemes')
        .then(user => {
            let found = false;
            for(let i in user.colorSchemes) {
                let colorScheme = user.colorSchemes[i];
                if(colorScheme._id == req.body.colorSchemeId) {
                    user.colorSchemes.splice(i, 1);
                    found = true;
                    user.save()
                        .catch(err => res.status(400).send('Error: Could not remove color scheme from user: ' + err));
                    break;
                }
            }

            if(!found) {
                return res.send("Error: Could not find color scheme of that ID in the user.");
            }

            ColorSchemeSchema.findByIdAndDelete(req.body.colorSchemeId)
                .then(colorScheme => res.send("Color scheme deleted."))
                .catch(err => res.status(400).send("Error: Could not delete color scheme: " + err));
        })
        .catch(err => res.status(400).send("Error: Could not find that user: " + err));
});

module.exports = router;
