const ObjectValidator = require("../validators/ObjectValidator.js");
const appendErrorToErrorsList = require("../appendErrorToErrorsList/appendErrorToErrorsList.js");
const Joi = require("joi");

module.exports = class PUTBodyValidator {
    constructor(collection, joiSchema) {
        this.collection = collection;
        this.joiSchema = joiSchema;
    }

    validateCollection() {
        // In PUT, bottles in body don't require all properties, except ID.
        let errors = [];

        this.collection.forEach(
            (object, index) => {
                const result =
                    Joi.validate(
                        object,
                        this.joiSchema,
                        { allowUnknown: true, abortEarly: false }
                    );

                if (!_.isNull(result.error)) {
                    result.error.details.forEach(detail => {
                        errors.push(new PropertyError(`body[${index}]`,
                            result.value[detail.context.key],
                            detail.message
                        ));
                    });
                }
            }
        );

        return errors;
    }
}