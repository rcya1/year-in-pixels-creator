const router = require("express").Router();
let UserSchema = require("../models/user.model");
let DataSchema = require("../models/data.model");
const asyncHandler = require("express-async-handler");
let { log, Status } = require("./route_logger");

/**
 * GET
 * Returns an array of JSON objects with all of the color/comments data for the currently logged in user
 *
 * Body Content Required:
 *  includeData - whether or not to include the full color scheme and data parameters
 */
router.route("/").get(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    let user = await UserSchema.findById(req.user._id).populate("data");

    if (!req.body.includeData) {
      for (let i in user.data) {
        user.data[i].values = null;
        user.data[i].comments = null;
      }
    }

    res.json(user.data);
  })
);
/**
 * GET
 * Returns a JSON object with all of the color/comments data for a speciic year for the currently logged in user
 */
router.route("/:year").get(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    let year = parseInt(req.params.year);

    let user = await UserSchema.findById(req.user._id).populate("data");
    for (let dataId of user.data) {
      let data = await DataSchema.findById(dataId);
      if (data.year == year) {
        res.json(data);
        return;
      }
    }

    log(res, Status.ERROR, "Could not find that year in the current user");
  })
);

/**
 * POST
 * Adds a new year for the currently logged in user
 */
router.route("/:year").post(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    let year = parseInt(req.params.year);

    let user = await UserSchema.findById(req.user._id).populate("data");

    for (let data of user.data) {
      if (data.year == year) {
        log(res, Status.ERROR, "Data with that year already exists.");
        break;
      }
    }

    let values = Array(12 * 31).fill(0);
    let comments = Array(12 * 31).fill("");

    const newData = {
      year: year,
      values: values,
      comments: comments,
    };
    let data = new DataSchema(newData);
    await data.save();

    user.data.push(data._id);
    await user.save();
    log(res, Status.SUCCESS, "Added data to user.");
  })
);

/**
 * PUT
 * Edits the color values and comments for an entire year for the currently logged in user
 *
 * Body Content Required:
 *  values   - Number array representing the new color values for this year
 *  comments - String array representing the new comments for this year
 */
router.route("/:year").put(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    let year = parseInt(req.params.year);

    let user = await UserSchema.findById(req.user._id).populate("data");
    for (let dataId of user.data) {
      let data = await DataSchema.findById(dataId);
      if (data.year == year) {
        for (let i = 0; i < 12 * 31; i++) {
          data.values.set(i, req.body.values[i]);
          data.comments.set(i, req.body.comments[i]);
        }

        await data.save();
        log(res, Status.SUCCESS, "Edited data.");

        return;
      }
    }
  })
);

/**
 * DELETE
 * Deletes a year for the currently logged in user
 */
router.route("/:year").delete(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    let year = parseInt(req.params.year);

    let user = await UserSchema.findById(req.user._id).populate("data");

    let id = -1;

    for (let i in user.data) {
      let data = user.data[i];
      if (data.year == year) {
        id = data._id;
        user.data.splice(i, 1);
        await user.save();
        break;
      }
    }

    if (id == -1)
      log(
        res,
        Status.ERROR,
        "Could not find data for that year in the current user."
      );

    await DataSchema.findByIdAndDelete(id);
    log(res, Status.SUCCESS, "Data deleted.");
  })
);

/**
 * GET
 * Returns an array of the color values for a specific year for the currently logged in user
 */
router.route("/values/:year").get(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    let year = parseInt(req.params.year);

    let user = await UserSchema.findById(req.user._id).populate("data");
    for (let dataId of user.data) {
      let data = await DataSchema.findById(dataId);
      if (data.year == year) {
        res.json(data.values);
        return;
      }
    }

    log(res, Status.ERROR, "Could not find that year in the current user");
  })
);

/**
 * GET
 * Returns an array of the comment data for a specific year for the currently logged in user
 */
router.route("/comments/:year").get(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    let year = parseInt(req.params.year);

    let user = await UserSchema.findById(req.user._id).populate("data");
    for (let dataId of user.data) {
      let data = await DataSchema.findById(dataId);
      if (data.year == year) {
        res.json(data.comments);
        return;
      }
    }

    log(res, Status.ERROR, "Could not find that year in the current user");
  })
);

/**
 * GET
 * Returns a JSON with the color/comments data for a specific date for the currently logged in user
 */
router.route("/:year/:month/:day").get(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    let year = parseInt(req.params.year);
    let month = parseInt(req.params.month);
    let day = parseInt(req.params.day);

    if (!validateDate(res, month, day)) return;

    let user = await UserSchema.findById(req.user._id).populate("data");
    for (let dataId of user.data) {
      let data = await DataSchema.findById(dataId);
      if (data.year == year) {
        let index = (month - 1) * 31 + day - 1;
        let value = data.values[index];
        let comment = data.comments[index];
        res.json({
          value: value,
          comment: comment,
        });
        return;
      }
    }

    log(res, Status.ERROR, "Could not find that year in the current user");
  })
);

/**
 * PUT
 * Edits the color value and comment for a specific date for the currently logged in user
 *
 * Body Content Required:
 *  value   - Number representing the new color value for this date
 *  comment - String representing the new comment for this date
 */
router.route("/:year/:month/:day").put(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    let year = parseInt(req.params.year);
    let month = parseInt(req.params.month);
    let day = parseInt(req.params.day);

    if (!validateDate(res, month, day)) return;

    let user = await UserSchema.findById(req.user._id).populate("data");
    for (let dataId of user.data) {
      let data = await DataSchema.findById(dataId);
      if (data.year == year) {
        let index = (month - 1) * 31 + day - 1;
        data.values.set(index, req.body.value);
        data.comments.set(index, req.body.comment);

        await data.save();
        log(res, Status.SUCCESS, "Edited data.");

        return;
      }
    }

    log(res, Status.ERROR, "Could not find that year in the current user");
  })
);

/**
 * GET
 * Returns the color value for a specific date for the currently logged in user
 */
router.route("/values/:year/:month/:day").get(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    let year = parseInt(req.params.year);
    let month = parseInt(req.params.month);
    let day = parseInt(req.params.day);

    if (!validateDate(res, month, day)) return;

    let user = await UserSchema.findById(req.user._id).populate("data");
    for (let dataId of user.data) {
      let data = await DataSchema.findById(dataId);
      if (data.year == year) {
        let index = (month - 1) * 31 + day - 1;
        let value = data.values[index];
        res.json(value);
        return;
      }
    }

    log(res, Status.ERROR, "Could not find that year in the current user");
  })
);

/**
 * PUT
 * Edits the color value for a specific date for the currently logged in user
 *
 * Body Content Required:
 *  value - Number representing the new color value for this date
 */
router.route("/values/:year/:month/:day").put(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    let year = parseInt(req.params.year);
    let month = parseInt(req.params.month);
    let day = parseInt(req.params.day);

    if (!validateDate(res, month, day)) return;

    let user = await UserSchema.findById(req.user._id).populate("data");
    for (let dataId of user.data) {
      let data = await DataSchema.findById(dataId);
      if (data.year == year) {
        let index = (month - 1) * 31 + day - 1;
        data.values.set(index, req.body.value);

        await data.save();
        log(res, Status.SUCCESS, "Edited data.");

        return;
      }
    }

    log(res, Status.ERROR, "Could not find that year in the current user");
  })
);

/**
 * GET
 * Returns the comment for a specific date for the currently logged in user
 */
router.route("/comments/:year/:month/:day").get(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    let year = parseInt(req.params.year);
    let month = parseInt(req.params.month);
    let day = parseInt(req.params.day);

    if (!validateDate(res, month, day)) return;

    let user = await UserSchema.findById(req.user._id).populate("data");
    for (let dataId of user.data) {
      let data = await DataSchema.findById(dataId);
      if (data.year == year) {
        let index = (month - 1) * 31 + day - 1;
        let comment = data.comments[index];
        res.json(comment);
        return;
      }
    }

    log(res, Status.ERROR, "Could not find that year in the current user");
  })
);

/**
 * PUT
 * Edits the comment for a specific date for the currently logged in user
 *
 * Body Content Required:
 *  comment - String representing the new comment for this date
 */
router.route("/comments/:year/:month/:day").put(
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      log(res, Status.ERROR, "User is not logged in");
      return;
    }

    let year = parseInt(req.params.year);
    let month = parseInt(req.params.month);
    let day = parseInt(req.params.day);

    if (!validateDate(res, month, day)) return;

    let user = await UserSchema.findById(req.user._id).populate("data");
    for (let dataId of user.data) {
      let data = await DataSchema.findById(dataId);
      if (data.year == year) {
        let index = (month - 1) * 31 + day - 1;
        data.comments.set(index, req.body.comment);
        return;
      }

      await data.save();
      log(res, Status.SUCCESS, "Edited comment.");
      return;
    }

    log(res, Status.ERROR, "Could not find that year in the current user");
  })
);

function validateDate(res, month, day) {
  if (
    month == undefined ||
    day == undefined ||
    month <= 0 ||
    day <= 0 ||
    month > 12 ||
    day > 31
  ) {
    log(res, Status.ERROR, "Date given is not valid");
    return false;
  }

  return true;
}

module.exports = router;
