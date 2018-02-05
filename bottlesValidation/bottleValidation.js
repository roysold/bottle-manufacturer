const PropertyError = require("./PropertyError.js");
const validator = require("validator");

let properBottleObject = {
    "id": "1",
    "creationDate": "2017-11-01",
    "orderID": "1",
    "factoryID": "1"
};

const alphanumericProperties = ["id", "orderID", "factoryID"];
const dateProperties = ["creationDate"];

function isString(value) {
    return typeof value === "string";
}

function isAlphanumericString(value) {
    return isString(value) &&
        validator.isAlphanumeric(value);
}

function isValidDateFormat(value) {
    return isString(value) &&
        validator.isISO8601(value);
}

module.exports = function validateBottle(properties) {
    return (bottle, index = -1) => {
        let errorObj = {};
        errorObj.errors = {};

        const alphanumericPropertiesToValidate =
            alphanumericProperties.filter(
                propName =>
                    properties.includes(propName)
            );

        // Validate alphanumeric properties.
        alphanumericPropertiesToValidate.forEach(propName => {
            if (!isAlphanumericString(bottle[propName])) {
                errorObj.errors[propName] =
                    new PropertyError(
                        index === -1 ? "body" : `body[${index}]`,
                        bottle[propName],
                        "Must be an alphanumeric string without whitespace. Must not be empty."
                    );
            }
        });

        const datePropertiesToValidate =
            dateProperties.filter(
                propName =>
                    properties.includes(propName)
            );

        // Validate date properties.
        datePropertiesToValidate.forEach(propName => {
            if (!isValidDateFormat(bottle[propName])) {
                errorObj.errors[propName] =
                    new PropertyError(
                        index === -1 ? "body" : `body[${index}]`,
                        bottle[propName],
                        "Must be a string in ISO8601 format."
                    );
            }
        });

        // // Check for properties that don't belong.
        // for (property in bottle) {
        //     if (!properties.includes(property)) {
        //         errorObj.errors[property] =
        //             new PropertyError(
        //                 index === -1 ? "body" : `body[${index}]`,
        //                 bottle[property],
        //                 `${property} is not a property that can be included.`
        //             );
        //     }
        // }

        if (Object.keys(errorObj.errors).length === 0) {
            errorObj = {};
        }

        return errorObj;
    }
}