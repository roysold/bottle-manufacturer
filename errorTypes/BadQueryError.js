const httpStatusCodes = require("http-status-codes");

module.exports = class BadQueryError extends Error {
    constructor(errorJSON) {
        super("");
        this.errorJSON = errorJSON;
    }

    get httpErrorCode() {
        return httpStatusCodes.BAD_REQUEST;
    }
}