const Status = Object.freeze({
    SUCCESS: "SUCCESS",
    ERROR: "ERROR"
});

function log(res, status, message) {
    res.json("[" + status + "] " + message);
}

module.exports = {
    log: log,
    Status: Status
};
