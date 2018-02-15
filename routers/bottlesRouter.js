import express from "express";
import httpStatusCodes from "http-status-codes";

/* Error types */
import { UnprocessableEntityError, BadQueryError, IDNotFoundError } from "../errorTypes/index.js";

/* CRUD Functions*/
import { getObjects, addObjects, updateObjects, deleteByIndex } from "../CRUD/index.js";

/* POST bottles */
import generateNextNumericID from "../IDGenerators/IDGenerators.js";

/* PUT ID Validation */
import { checkForNonExistentID, checkForIDConflicts } from "../IDValidations/IDValidations.js";

/* ID Validation */
import appendErrorToErrorsList from "../appendErrorToErrorsList/appendErrorToErrorsList.js"; //
import getIndexByID from "../IDParamMiddleware/getIndexByID.js";

/* Query Validation */
import { filteringQueryValidations } from "../queryValidationData/index.js";

/* Body Validation */
import convertBodyToArray from "../convertBodyToArrayMiddleware/convertBodyToArray.js";
import bottleSchema from "../schemas/bottleSchemas.js";

/* Validators */
import { validateCollection, validateQuery } from "../validators/index.js";

/* Entity Properties */
import { entityProperties, IDPropertyName, dateProperties } from "../entityProperties/bottleProperties.js";

/* Data */
let collection = require("../data/bottles.json");
import { addLinksPropertyToList } from "../filters/listFilters.js";
import concatURLs from "../concatURLs/concatURLs.js";

const router = express.Router();

collection = addLinksPropertyToList(
    collection, bottle =>
        [
            ["self", concatURLs("/api/v1/bottles", bottle[IDPropertyName])]
        ]
);

function queryValidations(req, res, next) {
    res.locals.errors = [];
    const queryError = validateQuery(req.query, filteringQueryValidations(entityProperties));

    appendErrorToErrorsList(res.locals.errors, queryError);

    next()
}

// example route: /api/v1/bottles?sort=-id,creationDate,%2BfactoryID&fields=id,orderID,factoryID&offset=-2&limit=1
// Route sorts by descending id, ascending creationDate and factoryID.
// Displays id, orderID and factoryID fields.
// Gets only the second last object.
router.get("/",
    queryValidations,
    (req, res, next) => {
        if (res.locals.errors.length) {
            next(new BadQueryError(res.locals.errors));
        } else {
            let objectsToSend = getObjects(
                collection,
                dateProperties,
                req.query
            );

            res.json(objectsToSend);
        }
    }
);

router.param("id",
    (req, res, next) => {
        res.locals.indexOfObjectByID = getIndexByID(collection, req.params[IDPropertyName], IDPropertyName);

        res.locals.indexOfObjectByID === -1 ?
            next(new IDNotFoundError(req.params[IDPropertyName], "params"))
            : next();
    }
);

router.get("/:id", (req, res) => {
    res.json(collection[res.locals.indexOfObjectByID]);
});

router.delete("/:id", (req, res) => {
    deleteByIndex(collection, res.locals.indexOfObjectByID);

    res.status(httpStatusCodes.OK)
        .send("Bottle deleted.");
});

function bodyValidations(req, res, next) {
    res.locals.errors =
        validateCollection(
            req.body,
            bottleSchema[req.method]
        );

    next();
}

const IDGenerator = generateNextNumericID("9");

router.post("/",
    convertBodyToArray,
    bodyValidations,
    (req, res, next) => {
        if (res.locals.errors.length) {
            next(new UnprocessableEntityError(res.locals.errors));
        } else {
            collection = addObjects(
                collection,
                req.body,
                entityProperties,
                IDPropertyName,
                IDGenerator,
                object => [["self", concatURLs(req.originalUrl, object[IDPropertyName])]]
            );

            res.status(httpStatusCodes.CREATED).send();
        }
    }
);

router.put("/",
    convertBodyToArray,
    bodyValidations,
    checkForNonExistentID(collection, IDPropertyName),
    checkForIDConflicts(IDPropertyName),
    (req, res, next) => {
        if (res.locals.errors.length !== 0) {
            next(new UnprocessableEntityError(res.locals.errors));
        } else {
            updateObjects(collection, req.body, entityProperties, IDPropertyName);
            res.send()
        }
    }
);


export default router;