function sortByField(list, sortFields, dateFields) {
    let sortedList = list.slice();

    sortFields.slice().reverse().forEach(
        sortfield => {
            let field = sortField.replace(/^(\+|-)/, "");

            sortedList.sort(
                getCompareItemByFieldFunction(
                    field,
                    dateFields.includes(field),
                    !sortField.startsWith("-")
                )
            );
        }
    )
    return sortedList;
}

function getListWithSelectedFields(list, fields) {
    return list.map(
        obj => {
            let objWithSelectedfields = {};

            fields.forEach(field => {
                objWithSelectedfields[field] = obj[field];
            });

            return objWithSelectedfields;
        }
    )
}

function getCompareItemByFieldFunction(field, isDate, ascending) {
    if (!ascending) {
        return (item1, item2) => {
            let { value1, value2 } = getComparableValues(item1[field], item2[field], isDate);

            if (value1 < value2) {
                return 1;
            } else if (value1 > value2) {
                return -1;
            } else {
                return 0;
            }
        }
    } else {
        return (item1, item2) => {
            let { value1, value2 } = getComparableValues(item1[field], item2[field], isDate);

            if (value1 > value2) {
                return 1;
            } else if (value1 < value2) {
                return -1;
            } else {
                return 0;
            }
        }
    }
}

function getComparableValues(value1, value2, isDate) {
    if (isDate) {
        value1 = new Date(value1);
        value2 = new Date(value2);
    }

    return {
        value1: value1,
        value2: value2
    }
}

function addLinksPropertyToList(list, generateLinks) {
    return list.map(object => addLinksPropertyToObject(object, generateLinks(object)))
}

// param: linkDataToAdd - A list of lists, 
// where each inner list has the format: [rel, href].
function addLinksPropertyToObject(obj, linkDataToAdd) {
    let objectToReturn = Object.assign({}, obj);

    if (!obj.hasOwnProperty("links")) {
        objectToReturn.links = [];
    }

    linkDataToAdd.forEach(linkData => {
        objectToReturn.links.push({
            rel: linkData[0],
            href: linkData[1]
        });
    });

    return objectToReturn;
}

module.exports = {
    sortByField: sortByField,
    getListWithSelectedFields: getListWithSelectedFields,
    addLinksPropertyToList: addLinksPropertyToList,
    addLinksPropertyToObject: addLinksPropertyToObject
}