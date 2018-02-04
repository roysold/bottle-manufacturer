const PropertyError = require("./PropertyError.js");
const validator = require("validator");

let properBottleObject = {
    "id": "1",
    "creationDate": "2017-11-01",
    "orderID": "1",
    "factoryID": "1"
};

const alphanumericProperties = ["ID", "orderID", "factoryID"];
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
                    bottle[propName] !== undefined &&
                    alphanumericProperties.includes(propName)
            );

        const datePropertiesToValidate =
            dateProperties.filter(
                propName =>
                    bottle[propName] !== undefined &&
                    dateProperties.includes(propName)
            );

        // Validate alphanumeric properties.
        alphanumericPropertiesToValidate.forEach(propName => {
            if (!isAlphanumericString(bottle[propName])) {
                errorObj.errors[propName] =
                    new PropertyError(
                        index === -1 ? "body" : `body[${index}]`,
                        bottle[propName],
                        "Must be a string. Must not be empty."
                    );
            }
        });

        // Validate date properties.
        datePropertiesToValidate.forEach(propName => {
            if (!isValidDateFormat(bottle[propName])) {
                errorObj.errors[propName] =
                    new PropertyError(
                        index === -1 ? "body" : `body[${index}]`,
                        bottle[propName],
                        "Must be in ISO8601 format."
                    );
            }
        });

        // Check for properties that don't belong.
        for (property in bottle) {
            if (!properties.includes(property)) {
                errorObj.errors[property] =
                    new PropertyError(
                        index === -1 ? "body" : `body[${index}]`,
                        bottle[property],
                        `${property} is not a property that can be included.`
                    );
            }
        }

        return errorObj;
    }
}