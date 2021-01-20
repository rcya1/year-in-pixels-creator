const router = require('express').Router();
const passport = require('passport');

router.route('/login').post((req, res, next) => {
    if(req.isAuthenticated()) {
        return res.send("Error: The user " + req.user.username + " is already logged in.");
    }

    passport.authenticate('local', (err, user, info) => {
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

            return res.send("Successfully logged into the user " + user.username);
        });
    })(req, res, next);
});

router.route('/logout').post((req, res, next) => {
    if(req.isAuthenticated()) {
        req.logOut();
        return res.send("Successfully logged out.");
    }

    res.send("Error: The user is not logged in");
});

module.exports = router;
