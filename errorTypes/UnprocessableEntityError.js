import httpStatusCodes from "http-status-codes";

export default class UnprocessableEntityError {
    constructor(errors, message) {
        this.errors = errors;
        this.message = message;
    }

    get errorJSON() {
        return this.errors;
    }

    get httpErrorCode() {
        return httpStatusCodes.UNPROCESSABLE_ENTITY;
    }
}