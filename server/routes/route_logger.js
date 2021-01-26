const Status = Object.freeze({
    SUCCESS: "SUCCESS",
    ERROR: "ERROR"
});

function log(res, status, message) {
    if(status == Status.ERROR) {
        res = res.status(500);
    }
    
    res.json("[" + status + "] " + message);
}

module.exports = {
    log: log,
    Status: Status
};
