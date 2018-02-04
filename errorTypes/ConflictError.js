class ConflictError extends Error {
    constructor(message, id) {
        super(message);
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