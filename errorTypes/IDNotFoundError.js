const httpStatusCodes = require("http-status-codes");

class IDNotFoundError extends Error {
    constructor(id) {
        super("");
        this.id = id;
    }

    get errorJSON() {
        return {
            error: `No bottle with the ID '${this.id}'.`
        }
    }

    get httpErrorCode() {
        return httpStatusCodes.BAD_REQUEST;
    }
}