const router = require('express').Router();
const { json } = require('express');
let UserSchema = require('../models/user.model');
const passport = require('passport');

router.route('/register').post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const newUser = {
        username: username,
        colorSchemes: [],
        data: []
    };

    UserSchema.register(new UserSchema(newUser), password, (err, user) => {
            if(err) {
                return res.send("Unable to register user: " + err);
            }

            passport.authenticate('local')(req, res, function() {
                res.send("Successfully added the user!");
            });
    });
});

router.route('/login').post((req, res, next) => {
    console.log(req.isAuthenticated());
    passport.authenticate('local', (err, user, info) => {
        // console.log(err + " : " + user + " : " + info);
        if(err) {
            return res.send("Error: " + err);
        }

        if(!user) {
            return res.send(info);
        }
        
        req.logIn(user, (err) => {
            if(err) {
                res.send("Error: " + err);
            }

            return res.send(user.colorSchemes);
        });
    })(req, res, next);
});

router.route('/random').get((req, res, next) => {
    if(req.isAuthenticated()) {
        console.log(req.user);
    }

    res.send("Test");
});

module.exports = router;
