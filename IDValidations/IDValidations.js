import { IDNotFoundError, ConflictError } from "../errorTypes/index.js";

function getNonExistentIDObjectIndex(objects, objectsToCheck, IDPropertyName) {
    return objectsToCheck.findIndex(objectToCheck =>
        !objects
            .map(object => object[IDPropertyName])
            .includes(objectToCheck[IDPropertyName])
    );
}

function findConflictingIDInList(list, IDPropertyName) {
    let IDs = [];
    let conflictingID = "";

    for (let item of list) {
        const curID = item[IDPropertyName];

        if (IDs.includes(curID)) {
            conflictingID = curID;
            break;
        } else {
            IDs.push(curID);
        }
    }

    return conflictingID;
}

const isArrayEmpty = arr => arr.length === 0;

const checkForNonExistentID = (collection, IDPropertyName) =>
    (req, res, next) => {
        if (isArrayEmpty(res.locals.errors)) {
            const nonExistentIDEntityIndex = getNonExistentIDObjectIndex(
                collection,
                req.body,
                IDPropertyName
            );

            if (nonExistentIDEntityIndex !== -1) {
                next(new IDNotFoundError(req.body[nonExistentIDEntityIndex][IDPropertyName]));
            }
        }

        next();
    }

const checkForIDConflicts = IDPropertyName =>
    (req, res, next) => {
        if (isArrayEmpty(res.locals.errors)) {
            const conflictingID = findConflictingIDInList(req.body, "id");

            if (conflictingID !== "") {
                next(new ConflictError(conflictingID));
            }
        }

        next();
    }

export {
    checkForNonExistentID,
    checkForIDConflicts
};