const express = require('express');
const httpStatusCodes = require("http-status-codes");
const bodyParser = require("body-parser");

/* Error types */
const UnprocessableEntityError = require("../errorTypes/UnprocessableEntityError.js");
const BadQueryError = require("../errorTypes/BadQueryError.js");
const IDNotFoundError = require("../errorTypes/IDNotFoundError.js");

/* GET bottles */
const GETEntities = require("../GET_middleware/GETEntities.js");

/* POST bottles */
const addObjects = require("../POST_middleware/addObjects.js");
const generateNextNumericID = require("../IDGenerators/IDGenerators.js");

/* PUT bottles */
const { updateEntities } = require("../PUT_middleware/updateEntities.js");
const { checkForNonExistentID, checkForIDConflicts } = require("../IDValidations/IDValidations.js");

/* ID Validation */
const appendObjectIfObjectNotEmpty = require("../appendObjectIfObjectNotEmpty/appendObjectIfObjectNotEmpty.js");
const { getIndexByID, deleteFromCollectionByID } = require("../IDParamMiddleware/IDParamMiddleware.js");

/* Query Validation */
const queryValidator = require("../validators/queryValidator.js");
const filteringQueryValidations = require("../queryValidationData/filteringQueryValidation.js");

/* Body Validation */
const convertBodyToArray = require("../convertBodyToArrayMiddleware/convertBodyToArray.js");
const ObjectValidator = require("../validators/objectValidator.js");
const objectBodyValidations = require("../bodyValidationData/bottleTypeBodyValidation");
const POSTBodyValidator = require("../validators/POST_bodyValidator.js");
const PUTBodyValidator = require("../validators/PUT_bodyValidator.js");

/* Entity Properties */
const { entityProperties, IDPropertyName, dateProperties } = require("../entityProperties/bottleTypeProperties.js");

/* Data */
let collection = require("../data/bottleTypes.json");
const { addLinksPropertyToList } = require("../filters/listFilters.js");
const concatURLs = require("../concatURLs/concatURLs.js");

const router = express.Router();

collection = addLinksPropertyToList(
    collection, bottleType =>
        [
            ["self", concatURLs("/api/v1/bottles", bottleType[IDPropertyName])]
        ]
);

const filteringQueryValidator =
    new queryValidator(
        filteringQueryValidations(
            entityProperties
        )
    );

function queryValidations(req, res, next) {
    res.locals.errors = [];
    const queryError = filteringQueryValidator.validateQuery(req.query);

    appendObjectIfObjectNotEmpty(res.locals.errors, queryError);

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
            let objectsToSend = GETEntities(
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
        res.locals.indexOfObjectByID = getIndexByID(collection, req.params[IDPropertyName]);

        res.locals.indexOfObjectByID === -1 ?
            next(new IDNotFoundError(req.params[IDPropertyName], "params"))
            : next();
    }
);

router.get("/:id", (req, res) => {
    res.json(collection[res.locals.indexOfObjectByID]);
});

router.delete("/:id", (req, res) => {
    deleteFromCollectionByID(collection, res.locals.indexOfObjectByID);

    res.status(httpStatusCodes.ACCEPTED)
        .send("Bottle deleted.");
});

function bodyValidations(req, res, next) {
    const collectionValidatorType = collectionValidatorTypes[req.method];

    const collectionValidator = new collectionValidatorType(
        req.body,
        objectBodyValidations,
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


module.exports.router = router;