import _ from "lodash";
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

const checkForNonExistentID = (collection, IDPropertyName) =>
    (req, res, next) => {
        const nonExistentIDEntityIndex = getNonExistentIDObjectIndex(
            collection,
            req.body,
            IDPropertyName
        );

        if (nonExistentIDEntityIndex !== -1) {
            next(new IDNotFoundError(req.body[nonExistentIDEntityIndex][IDPropertyName]));
        }

        next();
    }

const checkForIDConflicts = IDPropertyName =>
    (req, res, next) => {
        const conflictingID = findConflictingIDInList(req.body, "id");

        if (!_.isEmpty(conflictingID)) {
            next(new ConflictError(conflictingID));
        }

        next();
    }

export {
    checkForNonExistentID,
    checkForIDConflicts
};