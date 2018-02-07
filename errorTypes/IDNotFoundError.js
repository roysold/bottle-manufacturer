const httpStatusCodes = require("http-status-codes");

module.exports = class IDNotFoundError extends Error {
    constructor(id, location) {
        super("No bottle with this ID.");
        this.id = id;
        this.location = location;
    }

    get errorJSON() {
        return {
            error: {
                location: this.location,
                message: this.message,
                ID: this.id
            }
        }
    }

    get httpErrorCode() {
        return httpStatusCodes.BAD_REQUEST;
    }
}