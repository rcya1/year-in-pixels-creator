const mongoose = require("mongoose");
const validate = require("./validate");

const dataSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    values: {
      type: [Number],
      required: true,
      validate: [validate.validateDataLength, "Size of values is not correct!"],
    },
    comments: {
      type: [String],
      required: true,
      validate: [
        validate.validateDataLength,
        "Size of comments is not correct!",
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Data", dataSchema);
