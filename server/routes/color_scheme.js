const router = require('express').Router();
let UserSchema = require('../models/user.model');
let ColorSchemeSchema = require('../models/color_scheme.model');
let DataSchema = require('../models/data.model');
const passport = require('passport');

// TODO Paths for adding and editing color schemes
// TODO Get the multi line output messages working

router.route('/get').get((req, res, next) => {
    if(!req.isAuthenticated()) {
        return res.send("Error: The user is not logged in");
    }

    UserSchema.findById(req.user._id)
        .populate('colorSchemes')
        .then(user => res.json(user.colorSchemes))
        .catch(err => res.status(400).send("Could not find that user: " + err));
});

router.route('/delete').post((req, res, next) => {
    if(!req.isAuthenticated()) {
        return res.send("Error: The user is not logged in");
    }

    UserSchema.findById(req.user._id)
        .populate('colorSchemes')
        .then(user => {
            let found = false;
            let message = "";

            for(let i in user.colorSchemes) {
                let colorScheme = user.colorSchemes[i];
                if(colorScheme._id == req.body.colorSchemeId) {
                    user.colorSchemes.splice(i, 1);
                    found = true;
                    user.save()
                        .then(() => message += "Deleted color scheme from user " + user.username + "\n")
                        .catch(err => res.status(400).send('Error saving updated user: ' + err));
                    break;
                }
            }

            if(!found) {
                return res.send("Could not find color scheme of that ID in the user " + user.username);
            }

            ColorSchemeSchema.findByIdAndDelete(req.body.colorSchemeId)
                .then(colorScheme => res.send(message + "Color scheme deleted."))
                .catch(err => res.status(400).send("Error with deleting color scheme: " + err));
        })
        .catch(err => res.status(400).send("Could not find that user: " + err));
});

module.exports = router;
