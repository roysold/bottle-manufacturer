const ObjectValidator = require("../validators/ObjectValidator.js");
const appendErrorToErrorsList = require("../appendErrorToErrorsList/appendErrorToErrorsList.js");

module.exports = class PUTBodyValidator {
    constructor(collection, validationsObj, entityProperties, IDPropertyName) {
        this.collection = collection;
        this.validationsObj = validationsObj;
        this.entityProperties = entityProperties;
        this.IDPropertyName = IDPropertyName;
    }

    validateCollection() {
        // In PUT, bottles in body don't require all properties, except ID.
        let errors = [];

        this.collection.forEach(
            (object, index) => {
                let properties = this.getPropertiesToValidate(object);
                let objectValidator = new ObjectValidator(properties, this.validationsObj);
                let objectError = objectValidator.validateObject(object, index);

                appendErrorToErrorsList(errors, objectError);
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