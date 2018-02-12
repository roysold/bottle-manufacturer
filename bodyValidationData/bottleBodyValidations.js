const { isAlphanumericString, isValidDateFormat, isNumericString } = require("../validation/validations.js");

const areAllTrue = values => values.every(value => value === true);

const propertiesValidations = {
    "id": {
        isValid: (id) => areAllTrue([isNumericString(id)]),
        errorMsg: "Must be an numeric string without whitespace. Must not be empty."
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

module.exports = propertiesValidations;