// const ObjectValidator = require("../validators/ObjectValidator.js");
import PropertyError from "../validation/PropertyError.js";
// const Joi = require("joi");
// const _ = require("lodash");

export default function validateQuery(query, validationsObj) {
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
