const { sortByField, getListWithSelectedFields } = require("../filters/listFilters.js");

module.exports = function GETEntities(entities, dateProperties, query) {
    let { offset, limit, fields, sort } = query;

    sort = (sort === undefined) ? [] : sort.split(",");
    offset = (offset === undefined) ? 0 : parseInt(offset);
    limit = (limit === undefined) ? entities.length - offset : parseInt(limit);
    fields = (fields === undefined) ? undefined : fields.split(",");

    let sortedEntities = sortByField(entities.slice(), sort, dateProperties);

    let rangedEntities = sortedEntities.slice(offset, offset + limit);

    let entitiesWithSelectedFields =
        fields ?
            getListWithSelectedFields(rangedEntities, [...fields, "links"])
            : rangedEntities;

    return entitiesWithSelectedFields;
}