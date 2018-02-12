const express = require('express');
const httpStatusCodes = require("http-status-codes");

/* Error types */
const { UnprocessableEntityError, BadQueryError, IDNotFoundError } = require("../errorTypes/index.js");

/* CRUD Functions*/
const { getObjects, addObjects, updateObjects, deleteByIndex } = require("../CRUD/index.js");

/* POST bottles */
const generateNextNumericID = require("../IDGenerators/IDGenerators.js");

/* PUT ID Validation */
const { checkForNonExistentID, checkForIDConflicts } = require("../IDValidations/IDValidations.js");

/* ID Validation */
const appendObjectToList = require("../appendObjectIfObjectNotEmpty/appendObjectToList.js");
const getIndexByID = require("../IDParamMiddleware/getIndexByID.js");

/* Query Validation */
const { filteringQueryValidations } = require("../queryValidationData/index.js");

/* Body Validation */
const convertBodyToArray = require("../convertBodyToArrayMiddleware/convertBodyToArray.js");
const { bottleBodyValidations } = require("../bodyValidationData/index.js");

/* Validators */
const { POSTBodyValidator, PUTBodyValidator, QueryValidator } = require("../validators/index.js");

/* Entity Properties */
const { entityProperties, IDPropertyName, dateProperties } = require("../entityProperties/bottleProperties.js");

/* Data */
let collection = require("../data/bottles.json");
const { addLinksPropertyToList } = require("../filters/listFilters.js");
const concatURLs = require("../concatURLs/concatURLs.js");

const router = express.Router();

collection = addLinksPropertyToList(
    collection, bottle =>
        [
            ["self", concatURLs("/api/v1/bottles", bottle[IDPropertyName])]
        ]
);

const filteringQueryValidator =
    new QueryValidator(
        filteringQueryValidations(
            entityProperties
        )
    );

function queryValidations(req, res, next) {
    res.locals.errors = [];
    const queryError = filteringQueryValidator.validateQuery(req.query);

    try {
        appendObjectToList(res.locals.errors, queryError);
    } catch (error) {
        console.log(error);
    }

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
        res.locals.indexOfObjectByID = getIndexByID(collection, IDPropertyName, req.params[IDPropertyName]);

        res.locals.indexOfObjectByID === -1 ?
            next(new IDNotFoundError(req.params[IDPropertyName], "params"))
            : next();
    }
);

router.get("/:id", (req, res) => {
    res.json(collection[res.locals.indexOfObjectByID]);
});

router.delete("/:id", (req, res) => {
    deleteFromCollectionByIndex(collection, res.locals.indexOfObjectByID);

    res.status(httpStatusCodes.ACCEPTED)
        .send("Bottle deleted.");
});

function bodyValidations(req, res, next) {
    const collectionValidatorType = collectionValidatorTypes[req.method];

    const collectionValidator = new collectionValidatorType(
        req.body,
        bottleBodyValidations,
        entityProperties,
        IDPropertyName
    );

    res.locals.errors = collectionValidator.validateCollection();

    next();
}

const collectionValidatorTypes = {
    POST: POSTBodyValidator,
    PUT: PUTBodyValidator
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
            updateEntities(collection, req.body, entityProperties, IDPropertyName);
            res.send()
        }
    }
);


module.exports = router;