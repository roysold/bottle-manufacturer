const Joi = require("joi");

function areAllTrue(values) { return values.every(value => value === true); }

function filteringQueryValidations(fields) {

};

function sortFieldValidation(fields) {
    const sortFormatFields = [];

    fields.forEach(field => {
        sortFormatFields.concat([field, `-${field}`, `+${field}`]);
    });

    return Joi.string().valid(sortFormatFields);
}

// module.exports =