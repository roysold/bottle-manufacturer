const httpStatusCodes = require("http-status-codes");

module.exports = class BadQueryError {
    constructor(errorJSON) {
        this.errorJSON = errorJSON;
    }

    get httpErrorCode() {
        return httpStatusCodes.BAD_REQUEST;
    }
}