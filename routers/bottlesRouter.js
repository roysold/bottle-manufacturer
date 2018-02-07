let express = require('express');
const httpStatusCodes = require("http-status-codes");
let bodyParser = require("body-parser");
let { body, query, validationResult } = require('express-validator/check');
let bottles = require("../data/bottles.json");
let ConnectSequence = require('connect-sequence');
let ConflictError = require("../errorTypes/ConflictError.js");
let UnprocessableEntityError = require("../errorTypes/UnprocessableEntityError.js");
const IDNotFoundError = require("../errorTypes/IDNotFoundError.js");
let BadQueryError = require("../errorTypes/BadQueryError.js");
const generateNextNumericID = require("../IDGenerators/IDGenerators.js");
const { addLinksPropertyToList, addLinksPropertyToObject } = require("../filters/listFilters.js");
const GETEntities = require("../GET_middleware/GETEntities.js");
const addEntities = require("../POST_middleware/addEntities.js")
const concatURLs = require("../concatURLs/concatURLs.js");
const { updateEntities } = require("../PUT_middleware/updateEntities.js");
/* Query Validation */
const queryValidator = require("../validators/queryValidator.js");
const filteringQueryValidations = require("../queryValidationData/filteringQueryValidation.js");

/* Body Validation */
const BodyValidator = require("../validators/bodyValidator.js");
const bottleBodyValidations = require("../bodyValidationData/bottleBodyValidation");

let router = express.Router();

bottles = addLinksPropertyToList(
    bottles, bottle =>
        [
            ["self", concatURLs("/api/v1/bottles", bottle.id)]
        ]
)

const IDGenerator = generateNextNumericID("9");

router.use("/",
    (req, res, next) => {
        if (!Array.isArray(req.body)) {
            req.body = [req.body]
        }

        next();
    });

function bodyValidations(req, res, next) {
    let validateBottles = validateBottlesFunction[req.method];

    validateBottles(req, res, next);

    // Filter out empty error objects.
    res.locals.errors = res.locals.errors.filter(
        error => Object.keys(error).length
    );

    next();
}

const propertiesToValidate = {
    POST: () => {
        let properties = entityProperties.slice();
        properties.splice(properties.indexOf("id"), 1);

        return properties;
    },
    PUT: (bottle) => {
        let properties = Object.keys(bottle).filter(
            property => entityProperties.includes(property)
        );

        return ["id"].concat(properties);
    }
}

function appendErrorIfNotEmpty(res, errorObj) {
    if (Object.keys(errorObj).length) {
        res.locals.errors.push(errorObj);
    }
}

const validateBottlesFunction = {
    POST: (req, res) => {
        // In POST, bottles in body must have all properties except for ID.
        res.locals.errors = [];
        let properties = propertiesToValidate.POST();
        let bodyValidator = new BodyValidator(properties, bottleBodyValidations);

        req.body.forEach(
            (bottle, index) => {
                let bottleError = bodyValidator.validateBody(bottle, index);
                appendErrorIfNotEmpty(res, bottleError);
            }
        )
    },
    PUT: (req, res, next) => {
        // In PUT, bottles in body don't require all properties, except ID.
        res.locals.errors = [];

        req.body.forEach(
            (bottle, index) => {
                let properties = propertiesToValidate.PUT(bottle);
                let bodyValidator = new BodyValidator(properties, bottleBodyValidations);
                let bottleError = bodyValidator.validateBody(bottle, index);

                appendErrorIfNotEmpty(res, bottleError);
            }
        )

        if (res.locals.errors.length !== 0) {
            next();
        } else {
            let nonExistentIDEntityIndex = req.body.findIndex(object =>
                !bottles
                    .map(bottle => bottle["id"])
                    .includes(object["id"])
            );

            if (nonExistentIDEntityIndex !== -1) {
                next(new IDNotFoundError(req.body[nonExistentIDEntityIndex]["id"]));
            } else {
                const conflictingID = findConflictingIDInList(req.body, "id");

                if (conflictingID !== "") {
                    next(new ConflictError(conflictingID));
                }
            }
        }
    }
}

function findConflictingIDInList(list, IDPropertyName) {
    let IDs = new Map();
    let hasIDConflict = false;
    let conflictingID = "";

    // Check for ID conflicts.
    for (let index = 0;
        !hasIDConflict && (index < list.length);
        index++) {
        if (IDs.has(list[index][IDPropertyName])) {
            hasIDConflict = true;
            conflictingID = list[index][IDPropertyName];
        } else {
            IDs.set(list[index][IDPropertyName], 0);
        }
    }

    return conflictingID;
}

const entityProperties = ["id", "creationDate", "orderID", "factoryID"];

const filteringQueryValidator =
    new queryValidator(
        filteringQueryValidations(
            entityProperties
        )
    );

function queryValidations(req, res, next) {
    res.locals.errors = [];
    const queryError = filteringQueryValidator.validateQuery(req.query);

    appendErrorIfNotEmpty(res, queryError);

    next()
}

//TODO order the objects in post...

// example route: /api/v1/bottles?sort=-id,creationDate,\+factoryID&fields=id,orderID,factoryID&offset=-2&limit=1
// Route sorts by descending id, ascending creationDate
// and factoryID, displays id, orderID
// and factoryID fields and gets only the second last object.
router.get("/",
    queryValidations,
    (req, res, next) => {

        if (res.locals.errors.length) {
            next(new BadQueryError(res.locals.errors));
        } else {
            let bottlesToSend = GETEntities(
                bottles,
                ["creationDate"],
                req.query
            );

            res.json(bottlesToSend);
        }
    }
);

router.param("id", (req, res, next) => {
    res.locals.indexOfBottleByID =
        getIndexByID(bottles, req.params.id);

    res.locals.indexOfBottleByID === -1 ?
        sendBottleIDNotFoundError(req, res)
        : next();
});

router.get("/:id", (req, res) => {
    res.json(bottles[res.locals.indexOfBottleByID]);
});

router.delete("/:id", (req, res) => {
    bottles.splice(res.locals.indexOfBottleByID, 1);

    res.status(httpStatusCodes.ACCEPTED)
        .send("Bottle deleted.");
});

function setValidations(arrayValidations, objectValidations) {
    return (req, res) => req.body instanceof Array ? arrayValidations : objectValidations;
}

router.post("/", bodyValidations,
    (req, res, next) => {
        if (res.locals.errors.length) {
            next(new UnprocessableEntityError(res.locals.errors));
        } else {
            bottles = addEntities(
                bottles,
                req.body,
                entityProperties,
                "id",
                IDGenerator,
                entity =>
                    [
                        [
                            "self",
                            concatURLs(
                                req.originalUrl,
                                entity.id
                            )
                        ]
                    ]
            );

            res.status(httpStatusCodes.CREATED).send();
        }
    }
);

router.put("/", bodyValidations,
    (req, res, next) => {
        if (res.locals.errors.length) {
            next(new UnprocessableEntityError(res.locals.errors));
        } else {
            updateEntities(bottles, req.body, "id", entityProperties);
            res.send()
        }
    }
);

router.use("/", (err, req, res, next) => {
    console.log(`error: ${err.message}`); //TODO proper logs
    res.status(err.httpErrorCode).send(err.errorJSON);
});


function getIndexByID(list, id) {
    return list.findIndex(
        item => item.id === id
    );
}

module.exports.router = router;