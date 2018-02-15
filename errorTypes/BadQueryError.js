import httpStatusCodes from "http-status-codes";

export default class BadQueryError {
    constructor(errorJSON, message) {
        this.errorJSON = errorJSON;
        this.message = message;
    }

    get httpErrorCode() {
        return httpStatusCodes.BAD_REQUEST;
    }
}