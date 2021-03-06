import validator from "validator";

function isString(value) {
    return typeof value === "string"
}

const stringWithoutLastChar = str => str.slice(0, -1);
const lastCharOfString = str => str.substr(-1);

module.exports = {
    isAlphanumericString: value =>
        isString(value) && validator.isAlphanumeric(value),

    isValidDateFormat: value =>
        !isNaN(new Date(value).getTime()),

    isIn: (value, list) =>
        list.includes(value),

    isNumericString: value =>
        isString(value) && validator.isNumeric(value),

    isInSortFormat: (value, fields) => {
        let field = value.replace(/^(\+|-)/, "");

        return fields.includes(field);
    },

    isSizeFormatString: value =>
        isString(value) &&
        validator.isFloat(stringWithoutLastChar(value)) &&
        lastCharOfString(value)
}