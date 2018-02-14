import Joi from "joi";
import PropertyError from "../validation/PropertyError.js";
import _ from "lodash";

export default function validateCollection(collection, joiSchema) {
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