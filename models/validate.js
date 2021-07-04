function validateDataLength(arr) {
    return arr.length === 12 * 31;
}

function validateColorValue(color) {
    return color >= 0 && color <= 255;
}

function validateNonZeroLength(string) {
    return string.length > 0;
}

function validateUsernameLength(username) {
    return validateNonZeroLength(username) && username.length <= 20;
}

function validateBoolean(string) {
    let lower = string.toLowerCase();
    return lower === "true" || lower === "false";
}

function validateEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email.match(regex);
}

module.exports = {
    validateDataLength: validateDataLength,
    validateColorValue: validateColorValue,
    validateNonZeroLength: validateNonZeroLength,
    validateUsernameLength: validateUsernameLength,
    validateBoolean: validateBoolean,
    validateEmail: validateEmail
};
