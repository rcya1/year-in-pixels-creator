const router = require("express").Router();
let UserSchema = require("../models/user.model");
let DataSchema = require("../models/data.model");
let ColorSchemeSchema = require("../models/color_scheme.model");
const passport = require("passport");
const asyncHandler = require("express-async-handler");
let { log, Status } = require("./route_logger");

/**
 * GET
 * Returns an array of all of the color schemes for the currently logged in user
 */
router.route("/").get(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    let user = await UserSchema.findById(req.user._id).populate({
      path: "colorSchemes",
      options: {
        sort: {
          ordering: 1,
        },
      },
    });
    res.json(user.colorSchemes);
  })
);

/**
 * POST
 * Adds a color scheme to the currently logged in user
 *
 * Body Content Required:
 *  red   - Integer between 0 and 255 for the red value of the color scheme
 *  green - Integer between 0 and 255 for the blue value of the color scheme
 *  blue  - Integer between 0 and 255 for the green value of the color scheme
 *  label - String for the name of the color scheme
 */
router.route("/").post(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    // check if this color scheme label already exists
    let user = await UserSchema.findById(req.user._id).populate("colorSchemes");

    for (let colorScheme of user.colorSchemes) {
      if (colorScheme.label == req.body.label) {
        log(res, Status.ERROR, "Color scheme with that label already exists.");
        return;
      }
    }

    const newColorScheme = {
      red: Number(req.body.red),
      green: Number(req.body.green),
      blue: Number(req.body.blue),
      label: req.body.label,
      ordering: user.colorSchemes.length, // add to the end of the list
    };
    let colorScheme = new ColorSchemeSchema(newColorScheme);
    await colorScheme.save();

    user.colorSchemes.push(colorScheme._id);
    await user.save();
    log(res, Status.SUCCESS, "Added color scheme to user.");
  })
);

/**
 * PUT
 * Edits a color scheme of the currently logged in user
 *
 * Body Content Required:
 *  red      - New integer between 0 and 255 for the red value of the color scheme
 *  green    - New integer between 0 and 255 for the blue value of the color scheme
 *  blue     - New integer between 0 and 255 for the green value of the color scheme
 *  label    - New string for the name of the color scheme
 *  ordering - New integer for the relative ordering of the color scheme
 */
router.route("/:queryLabel").put(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    let user = await UserSchema.findById(req.user._id).populate("colorSchemes");

    let colorSchemeFound = null;
    for (let colorScheme of user.colorSchemes) {
      if (colorScheme.label == req.params.queryLabel) {
        colorSchemeFound = colorScheme;
        break;
      }
    }

    if (colorSchemeFound === null) {
      log(
        res,
        Status.ERROR,
        "Could not find color scheme with that label in the current user."
      );
      return;
    }

    colorSchemeFound.red = req.body.red;
    colorSchemeFound.green = req.body.green;
    colorSchemeFound.blue = req.body.blue;
    colorSchemeFound.label = req.body.label;
    colorSchemeFound.ordering = req.body.ordering;
    await colorSchemeFound.save();

    log(res, Status.SUCCESS, "Edited color scheme.");
  })
);

/**
 * DELETE
 * Deletes a color scheme of the currently logged in user
 */
router.route("/:queryLabel").delete(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    let user = await UserSchema.findById(req.user._id).populate("colorSchemes");

    let colorSchemeFound = null;
    for (let i in user.colorSchemes) {
      let colorScheme = user.colorSchemes[i];
      if (colorScheme.label == req.params.queryLabel) {
        colorSchemeFound = colorScheme;
        user.colorSchemes.splice(i, 1);
        await user.save();
        break;
      }
    }

    if (colorSchemeFound === null) {
      log(
        res,
        Status.ERROR,
        "Could not find color scheme of that label in the current user."
      );
      return;
    }

    await colorSchemeFound.delete();
    log(res, Status.SUCCESS, "Color scheme deleted.");
  })
);

/**
 * POST
 * Changes the ordering values of a given set of color scheme labels. Takes in an optional set of arguments that allow for
 * returning modified data values.
 *
 * Body Content Required:
 *  labels    - array of strings containing the labels of the color schemes to be changed
 *  orderings - array of integers containg the corresponding new orderings of the given color schemes
 *
 *  indices   - (OPTIONAL) array of integers that dictate how the ordering changed. This is used to determine how to modify the
 *              user datas to maintain the same colors
 *  year      - (OPTIONAL) current year to process (all years will be updated, but this year will be returned)
 */
router.route("/change-orderings").post(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    if (req.body.labels.length !== req.body.orderings.length) {
      log(res, Status.ERROR, "Array lengths do not match");
      return;
    }

    let user = await UserSchema.findById(req.user._id)
      .populate("colorSchemes")
      .populate("data");

    for (let i in req.body.labels) {
      let label = req.body.labels[i];
      let ordering = req.body.orderings[i];

      for (let j in user.colorSchemes) {
        if (user.colorSchemes[j].label === label) {
          user.colorSchemes[j].ordering = ordering;
          await user.colorSchemes[j].save();
          break;
        }
      }
    }

    if (req.body.indices !== undefined) {
      let returnValue = undefined;
      let year = parseInt(req.body.year);
      for (let i in user.data) {
        for (let d = 0; d < 12 * 31; d++) {
          user.data[i].values.set(
            d,
            req.body.indices.indexOf(user.data[i].values[d] - 1) + 1
          );
        }
        await user.data[i].save();
        if (user.data[i].year === year) {
          returnValue = user.data[i].values;
        }
      }

      res.json(returnValue);
    } else {
      log(res, Status.SUCCESS, "Updated color scheme orderings!");
    }
  })
);

module.exports = router;
