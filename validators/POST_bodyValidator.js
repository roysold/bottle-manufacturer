const {ObjectValidator} = require("../validators/index.js");
const appendObjectToList = require("../appendObjectToList/appendObjectToList.js");

module.exports = class POSTBodyValidator {
    constructor(collection, validationsObj, entityProperties, IDPropertyName) {
        this.collection = collection;
        this.validationsObj = validationsObj;

        this.propertiesToValidate = getPropertiesToValidate(entityProperties, IDPropertyName);
    }

    validateCollection() {
        // In POST, bottles in body must have all properties except for ID.        
        let errors = [];

        let objectValidator = new ObjectValidator(
            this.propertiesToValidate,
            this.validationsObj
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