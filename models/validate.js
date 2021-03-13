function validateDataLength(arr) {
    return arr.length === 12 * 31;
}

function validateColorValue(color) {
    return color >= 0 && color <= 255;
}

function validateNonZeroLength(string) {
    return string.length > 0;
}

function validateBoolean(string) {
    let lower = string.toLowerCase();
    return lower === "true" || lower === "false";
}

module.exports = {
    validateDataLength: validateDataLength,
    validateColorValue: validateColorValue,
    validateNonZeroLength: validateNonZeroLength,
    validateBoolean: validateBoolean
};
