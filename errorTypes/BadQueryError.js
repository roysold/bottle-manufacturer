import httpStatusCodes from "http-status-codes";

export default class BadQueryError {
    constructor(errorJSON) {
        this.errorJSON = errorJSON;
    }

    get httpErrorCode() {
        return httpStatusCodes.BAD_REQUEST;
    }
}