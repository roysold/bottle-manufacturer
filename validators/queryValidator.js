const PropertyError = require("../validation/PropertyError.js");

module.exports = class QueryValidator {
    constructor(validationsObj) {
        this.validationsObj = validationsObj;
    }

    validateQuery(query) {
        let errors = {};

        for (let param in query) {
            const paramValidationData = this.validationsObj[param];
            const paramValue = query[param];

            if (!paramValidationData.isValid(paramValue)) {
                errors[param] =
                    new PropertyError(
                        "query",
                        paramValue,
                        paramValidationData.errorMsg
                    );
            }
        }

        return Object.keys(errors).length === 0 ? {} : { errors: errors };
    }
}