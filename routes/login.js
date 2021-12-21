const router = require("express").Router();
const passport = require("passport");
let { log, Status } = require("./route_logger");

/**
 * POST
 * Logs the user into the application with the given credentials
 * Stores the login information in a session and returns a session ID in a cookie
 *
 * Body Content Required:
 *  username - username
 *  password - password
 */
router.route("/login").post((req, res, next) => {
  if (req.isAuthenticated()) {
    log(res, Status.ERROR, "The user is already logged in.");
    return;
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      log(res, Status.ERROR, err);
      return;
    }

    if (!user) {
      log(res, Status.ERROR, info);
      return;
    }

    req.logIn(user, (err) => {
      if (err) {
        log(res, Status.ERROR, err);
        return;
      }

      log(res, Status.SUCCESS, "Successfully logged in.");
    });
  })(req, res, next);
});

/**
 * POST
 * Logs the user out of the application
 */
router.route("/logout").post((req, res, next) => {
  if (req.isAuthenticated()) {
    req.logOut();
    log(res, Status.SUCCESS, "Successfully logged out.");
  } else {
    log(res, Status.ERROR, "The user is not logged in.");
  }
});

/**
 * GET
 * Returns whether or not the user is currently authenticated
 */
router.route("/authenticated").get((req, res, next) => {
  res.json(req.isAuthenticated());
});

module.exports = router;
