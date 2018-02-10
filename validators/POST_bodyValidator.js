const ObjectValidator = require("../validators/objectValidator.js");
const appendObjectIfObjectNotEmpty = require("../appendObjectIfObjectNotEmpty/appendObjectIfObjectNotEmpty.js");

module.exports = class POSTBodyValidator {
    constructor(collection, validations, entityProperties, IDPropertyName) {
        this.collection = collection;
        this.validations = validations;

        this.propertiesToValidate = getPropertiesToValidate(entityProperties, IDPropertyName);
    }

    validateCollection() {
        // In POST, bottles in body must have all properties except for ID.        
        let errors = [];

        let objectValidator = new ObjectValidator(
            this.propertiesToValidate,
            this.validations
        );

        this.collection.forEach(
            (object, index) => {
                let objectError = objectValidator.validateObject(object, index);
                appendObjectIfObjectNotEmpty(errors, objectError);
            }
        );

        return errors;
    }
}

function getPropertiesToValidate(entityProperties, IDPropertyName) {
    let propertiesToReturn = entityProperties.slice();
    propertiesToReturn
        .splice(propertiesToReturn.indexOf(IDPropertyName), 1);

    return propertiesToReturn;
}