// const ObjectValidator = require("../validators/ObjectValidator.js");
import PropertyError from "../validation/PropertyError.js";
// const Joi = require("joi");
const _ = require("lodash");

export default function validateQuery(query, validationsObj) {
    let errors = {};

    for (let param in query) {
        const paramValidationData = validationsObj[param];
        const paramValue = query[param];

        if (!paramValidationData.isValid(paramValue)) {
            errors[param] =
                new PropertyError(
                    `query[${param}]`,
                    paramValue,
                    paramValidationData.errorMsg
                );
        }
    }

    return _.isEmpty(Object.keys(errors)) ? {} : { errors: errors };
}
