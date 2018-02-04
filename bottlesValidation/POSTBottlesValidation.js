const bottleValidator = require("bottleValidator.js");

module.exports.POSTvalidateBottle = bottleValidator([
    "orderID", "factoryID"]);
/* function (bottle, index) {
    let errorObj = {};
    let alphanumericPropertiesToValidate = ["orderID", "factoryID"];

    // Validate alphanumeric properties.
    alphanumericPropertiesToValidate.forEach(propName => {
        if (!isAlphanumericString(bottle[propName])) {
            errorObj.errors[propName] =
                new PropertyError(
                    index === -1 ? "body" : `body[${index}]`,
                    bottle[propName],
                    "Property is required. Must be a string. Must not be empty."
                );
        }
    });

    // Validate creationDate property.
    if (!isValidDateFormat(bottle.creationDate)) {
        errorObj.errors["creationDate"] =
            new PropertyError(
                index === -1 ? "body" : `body[${index}]`,
                bottle.creationDate,
                "Property is required and must be in ISO8601 format."
            );
    }

    // Check for properties that don't belong.
    for (property in bottle) {
        if (!Object.keys(properObj).includes(property)) {
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
*/