const { addLinksPropertyToList } = require("../filters/listFilters.js");

// TODO insertEntities?
 //TODO addobjects or entities
module.exports = function addObjects(
    objects,
    objectsToAdd,
    entityProperties,
    IDPropertyName,
    IDGenerator,
    generateLinks
) {
    const cleanEntitiesToAdd = objectsToAdd.map(
        (entity, index) =>
            getObjectWithID(
                entity,
                entityProperties,
                IDPropertyName,
                IDGenerator
            )
    );

    const entitiesWithLinks = addLinksPropertyToList(
        cleanEntitiesToAdd, generateLinks
    );

    return objects.concat(entitiesWithLinks);
}

function getObjectWithID(object, properties, IDPropertyName, IDGenerator) {
    let objectWithID = {};

    properties.forEach(prop => {
        objectWithID[prop] = object[prop];
    });

    objectWithID[IDPropertyName] = IDGenerator.next().value;

    return objectWithID;
}