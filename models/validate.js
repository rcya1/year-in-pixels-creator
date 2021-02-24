function validateDataLength(arr) {
    console.log("Validate: " + arr.length);
    return arr.length === 12 * 31;
}

function validateColorValue(color) {
    return color >= 0 && color <= 255;
}

function validateNonZeroLength(string) {
    return string.length > 0;
}

module.exports = {
    validateDataLength: validateDataLength,
    validateColorValue: validateColorValue,
    validateNonZeroLength: validateNonZeroLength
};
