const Joi = require("joi");
const PropertyError = require("../validation/PropertyError.js");
const _ = require("lodash");

module.exports = function validateCollection(collection, joiSchema) {
    // In POST, bottles in body must have all properties except for ID.        
    let errors = [];

    collection.forEach(
        (object, index) => {
            const result =
                Joi.validate(
                    object, joiSchema,
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