module.exports = function updateObjects(listToUpdate, listWithUpdates, properties, IDPropertyName) {
    listWithUpdates.forEach(objectFromBody => {
        const entityToModify = listToUpdate.find(
            entity => entity[IDPropertyName] === objectFromBody[IDPropertyName]
        )

        updateObject(entityToModify, objectFromBody, properties);
    });
}

const hasProperty = (object, property) => object[property] !== undefined;

function updateObject(objToUpdate, objWithUpdates, properties) {
    properties.forEach(property => {
        if (hasProperty(objWithUpdates, property)) {
            objToUpdate[property] = objWithUpdates[property];
        }
    })
}