import { isInSortFormat, isIn, isNumericString } from "../validation/validations.js";

function areAllTrue(values) { return values.every(value => value === true); }

export default function filteringQueryValidations(fields) {
    return {
        "sort": {
            isValid: values =>
                values.split(",")
                    .every(value => areAllTrue([isInSortFormat(value, fields)])),
            errorMsg: "Needs to be either <field_name>, +<field_name>, -<field_name>."
        },
        "fields": {
            isValid: values => values.split(",")
                .every(value => areAllTrue([isIn(value, fields)])),
            errorMsg: "Needs to be one or more real fields."
        },
        "offset": {
            isValid: value => areAllTrue([isNumericString(value)]),
            errorMsg: "Needs to be an integer."
        },
        "limit": {
            isValid: value => areAllTrue([isNumericString(value)]),
            errorMsg: "Needs to be an integer."
        }
    }
}