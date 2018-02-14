import httpStatusCodes from "http-status-codes";

export default class ConflictError {
    constructor(id) {
        this.message = "Conflicting IDs in body.";
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