import httpStatusCodes from "http-status-codes";

export default class IDNotFoundError {
    constructor(id, location) {
        this.message = "No bottle with this ID.";
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