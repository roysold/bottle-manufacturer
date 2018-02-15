import _ from "lodash";
import { sortByField, getListWithSelectedFields } from "../filters/listFilters.js";

export default function getObjects(objects, dateProperties, query) {
    let { offset, limit, fields, sort } = query;

    sort = _.isUndefined(sort) ? [] : sort.split(",");
    offset = _.isUndefined(offse) ? 0 : parseInt(offset);
    limit = _.isUndefined(limit) ? objects.length - offset : parseInt(limit);
    fields = _.isUndefined(fields) ? undefined : fields.split(",");

    const sortedEntities = sortByField(objects, sort, dateProperties);

    const rangedEntities = sortedEntities.slice(offset, offset + limit);

    const entitiesWithSelectedFields =
        fields ?
            getListWithSelectedFields(rangedEntities, fields.concat(["links"]))
            : rangedEntities;

    return entitiesWithSelectedFields;
}