const PropertyError = require("../validation/PropertyError.js");

module.exports = class ObjectValidator {
    constructor(properties, validationsObj) {
        this.propertiesToValidate = properties;
        this.validationsObj = validationsObj;
    }

    validateObject(object, index = -1) {
        let errors = {};

        for (let property of this.propertiesToValidate) {
            const propertyValidationData = this.validationsObj[property];
            const propertyValue = object[property];

            if (!propertyValidationData.isValid(propertyValue)) {
                errors[property] =
                    new PropertyError(
                        index === -1 ? "body" : `body[${index}]`,
                        propertyValue,
                        propertyValidationData.errorMsg
                    );
            }
        }

        return Object.keys(errors).length === 0 ? {} : { errors };
    }
}