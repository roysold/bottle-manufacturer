const httpStatusCodes = require("http-status-codes");

class UnprocessableEntityError extends Error {
    constructor(errors) {
        super("");
        this.errors = errors;
    }

    get errorJSON() {
        return this.errors;
    }

    get httpErrorCode() {
        return httpStatusCodes.UNPROCESSABLE_ENTITY;
    }
}

module.exports = UnprocessableEntityError;