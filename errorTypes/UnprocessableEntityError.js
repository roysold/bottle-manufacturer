import httpStatusCodes from "http-status-codes";

export default class UnprocessableEntityError {
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