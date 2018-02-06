const PropertyError = require("../validation/PropertyError.js");
const { isAlphanumericString, isValidDateFormat } = require("../validation/validations.js");

const areAllTrue = values => values.every(value => value === true);

const propertiesValidations = {
    "id": {
        isValid: (id) => areAllTrue([isAlphanumericString(id)]),
        errorMsg: "Must be an alphanumeric string without whitespace. Must not be empty."
    },
    "creationDate": {
        isValid: (creationDate) => areAllTrue([isValidDateFormat(creationDate)]),
        errorMsg: "Must be a valid date format."
    },
    "orderID": {
        isValid: (orderID) => areAllTrue([isAlphanumericString(orderID)]),
        errorMsg: "Must be an alphanumeric string without whitespace. Must not be empty."
    },
    "factoryID": {
        isValid: (factoryID) => areAllTrue([isAlphanumericString(factoryID)]),
        errorMsg: "Must be an alphanumeric string without whitespace. Must not be empty."
    }
};

module.exports = function validateBottle(properties) {
    return (bottle, index = -1) => {
        let errors = {};

        for (property of properties) {
            const propertyValidation = propertiesValidations[property];
            const propertyValue = bottle[property];

            if (!propertyValidation.isValid(propertyValue)) {
                errors[property] =
                    new PropertyError(
                        index === -1 ? "body" : `body[${index}]`,
                        propertyValue,
                        propertyValidation.errorMsg
                    );
            }
        }

        return Object.keys(errors).length === 0 ? {} : { errors: errors };
    }
}


