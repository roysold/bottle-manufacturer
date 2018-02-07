function updateEntities(listToUpdate, listWithUpdates, properties, IDPropertyName) {
    listWithUpdates.forEach(entityFromBody => {
        const entityToModify = listToUpdate.find(
            entity => entity[IDPropertyName] === entityFromBody[IDPropertyName]
        )

        updateObject(entityToModify, entityFromBody, properties);
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

module.exports = {
    updateEntities: updateEntities
}