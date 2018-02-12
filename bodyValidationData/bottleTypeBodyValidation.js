const { isAlphanumericString, isValidDateFormat, isNumericString, isSizeFormatString } = require("../validation/validations.js");

const areAllTrue = values => values.every(value => value === true);

const propertiesValidations = {
    "id": {
        isValid: (id) => areAllTrue([isNumericString(id)]),
        errorMsg: "Must be an numeric string without whitespace. Must not be empty."
    },
    "name": {
        isValid: (name) => areAllTrue([isAlphanumericString(name)]),
        errorMsg: "Must be an alphanumeric string."
    },
    "size": {
        isValid: (size) => areAllTrue([isSizeFormatString(size)]),
        errorMsg: "Must be a number and then 'L'"
    }
};

module.exports = propertiesValidations;