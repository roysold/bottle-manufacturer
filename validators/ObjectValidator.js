const PropertyError = require("../validation/PropertyError.js");

module.exports = class ObjectValidator {
    constructor(properties, validations) {
        this.propertiesToValidate = properties;
        this.validations = validations;
    }

    validateObject(object, index = -1) {
        let errors = {};

        for (let property of this.propertiesToValidate) {
            const propertyValidation = this.validations[property];
            const propertyValue = object[property];

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