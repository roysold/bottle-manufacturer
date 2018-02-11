const express = require('express');
const httpStatusCodes = require("http-status-codes");
const bodyParser = require("body-parser");
const UnprocessableEntityError = require("../errorTypes/UnprocessableEntityError.js");
const BadQueryError = require("../errorTypes/BadQueryError.js");
const IDNotFoundError = require("../errorTypes/IDNotFoundError.js");
const generateNextNumericID = require("../IDGenerators/IDGenerators.js");
const { addLinksPropertyToList } = require("../filters/listFilters.js");
const GETEntities = require("../GET_middleware/GETEntities.js");
const addObjects = require("../POST_middleware/addObjects.js");
const concatURLs = require("../concatURLs/concatURLs.js");
const { updateEntities } = require("../PUT_middleware/updateEntities.js");
const { checkForNonExistentID, checkForIDConflicts } = require("../IDValidations/IDValidations.js");
const appendObjectIfObjectNotEmpty = require("../appendObjectIfObjectNotEmpty/appendObjectIfObjectNotEmpty.js");
const { setIndexOfObjectByID, deleteFromCollectionByID } = require("../IDParamMiddleware/IDParamMiddleware.js");
/* Query Validation */
const queryValidator = require("../validators/queryValidator.js");
const filteringQueryValidations = require("../queryValidationData/filteringQueryValidation.js");

/* Body Validation */
const ObjectValidator = require("../validators/objectValidator.js");
const bottleBodyValidations = require("../bodyValidationData/bottleBodyValidation");
const POSTBodyValidator = require("../validators/POST_bodyValidator.js");
const PUTBodyValidator = require("../validators/PUT_bodyValidator.js");

/* Entity Properties */
const { entityProperties, IDPropertyName, dateProperties } = require("../entityProperties/bottleProperties.js");

let bottles = require("../data/bottles.json");

let router = express.Router();

bottles = addLinksPropertyToList(
    bottles, bottle =>
        [
            ["self", concatURLs("/api/v1/bottles", bottle.id)]
        ]
);

const IDGenerator = generateNextNumericID("9");

function convertBodyToArray(req, res, next) {
    if (!Array.isArray(req.body)) {
        req.body = [req.body]
    }

    next();
}

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
            let bottlesToSend = GETEntities(
                bottles,
                dateProperties,
                req.query
            );

            res.json(bottlesToSend);
        }
    }
);

router.param("id",
    setIndexOfObjectByID(bottles),
    (req, res, next) => {
        res.locals.indexOfObjectByID === -1 ?
            next(new IDNotFoundError(req.params.id, "params"))
            : next();
    });

router.get("/:id", (req, res) => {
    res.json(bottles[res.locals.indexOfObjectByID]);
});

router.delete("/:id", (req, res) => {
    deleteFromCollectionByID(bottles);

    res.status(httpStatusCodes.ACCEPTED)
        .send("Bottle deleted.");
});

function setValidations(arrayValidations, objectValidations) {
    return (req, res) => req.body instanceof Array ? arrayValidations : objectValidations;
}

router.post("/",
    convertBodyToArray,
    bodyValidations,
    (req, res, next) => {
        if (res.locals.errors.length) {
            next(new UnprocessableEntityError(res.locals.errors));
        } else {
            bottles = addObjects(
                bottles,
                req.body,
                entityProperties,
                IDPropertyName,
                IDGenerator,
                entity => [["self", concatURLs(req.originalUrl, entity.id)]]
            );

            res.status(httpStatusCodes.CREATED).send();
        }
    }
);

router.put("/",
    convertBodyToArray,
    bodyValidations,
    checkForNonExistentID(bottles, IDPropertyName),
    checkForIDConflicts(IDPropertyName),
    (req, res, next) => {
        if (res.locals.errors.length !== 0) {
            next(new UnprocessableEntityError(res.locals.errors));
        } else {
            updateEntities(bottles, req.body, entityProperties, IDPropertyName);
            res.send()
        }
    }
);


module.exports.router = router;