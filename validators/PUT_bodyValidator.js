const ObjectValidator = require("../validators/objectValidator.js");
const appendObjectIfObjectNotEmpty = require("../appendObjectIfObjectNotEmpty/appendObjectIfObjectNotEmpty.js");

module.exports = class PUTBodyValidator {
    constructor(collection, validations, entityProperties, IDPropertyName) {
        this.collection = collection;
        this.validations = validations;
        this.entityProperties = entityProperties;
        this.IDPropertyName = IDPropertyName;
    }

    validateCollection() {
        // In PUT, bottles in body don't require all properties, except ID.
        let errors = [];

        this.collection.forEach(
            (object, index) => {
                let properties = this.getPropertiesToValidate(object);
                let objectValidator = new ObjectValidator(properties, this.validations);
                let bottleError = objectValidator.validateObject(object, index);

                appendObjectIfObjectNotEmpty(errors, bottleError);
            }
        );

        return errors;
    }

    getPropertiesToValidate(object) {
        let properties = Object.keys(object).filter(
            property => this.entityProperties.includes(property)
        );

        return [this.IDPropertyName].concat(properties);
    }
}