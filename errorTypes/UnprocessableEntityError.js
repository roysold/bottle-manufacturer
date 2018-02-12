const httpStatusCodes = require("http-status-codes");

class UnprocessableEntityError {
    constructor(errors) {
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