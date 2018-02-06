const PropertyError = require("../validation/PropertyError.js");

module.exports = class queryValidator {
    constructor(validations) {
        this.validations = validations;
    }

    validateQuery(query) {
        let errors = {};

        for (let param in query) {
            const paramValidation = this.validations[param];
            const paramValue = query[param];

            if (!paramValidation.isValid(paramValue)) {
                errors[param] =
                    new PropertyError(
                        "query",
                        paramValue,
                        paramValidation.errorMsg
                    );
            }
        }

        return Object.keys(errors).length === 0 ? {} : { errors: errors };
    }
}