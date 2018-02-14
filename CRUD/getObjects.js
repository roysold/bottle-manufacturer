import { sortByField, getListWithSelectedFields } from "../filters/listFilters.js";

export default function getObjects(objects, dateProperties, query) {
    let { offset, limit, fields, sort } = query;

    sort = (sort === undefined) ? [] : sort.split(",");
    offset = (offset === undefined) ? 0 : parseInt(offset);
    limit = (limit === undefined) ? objects.length - offset : parseInt(limit);
    fields = (fields === undefined) ? undefined : fields.split(",");

    const sortedEntities = sortByField(objects, sort, dateProperties);

    const rangedEntities = sortedEntities.slice(offset, offset + limit);

    const entitiesWithSelectedFields =
        fields ?
            getListWithSelectedFields(rangedEntities, [...fields, "links"])
            : rangedEntities;

    return entitiesWithSelectedFields;
}