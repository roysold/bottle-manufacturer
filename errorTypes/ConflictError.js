const httpStatusCodes = require("http-status-codes");

class ConflictError extends Error {
    constructor(id) {
        super("Conflicting IDs in body.");
        this.conflictingID = id;
    }

    get errorJSON() {
        return {
            error: {
                message: this.message,
                conflictingID: this.conflictingID
            }
        }
    }

    get httpErrorCode() {
        return httpStatusCodes.CONFLICT;
    }
}

module.exports = ConflictError;