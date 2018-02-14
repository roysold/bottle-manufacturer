// const ObjectValidator = require("../validators/ObjectValidator.js");
const PropertyError = require("../validation/PropertyError.js");
// const Joi = require("joi");
// const _ = require("lodash");

module.exports =
    function validateQuery(query, validationsObj) {
        let errors = {};

        for (let param in query) {
            const paramValidationData = validationsObj[param];
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
