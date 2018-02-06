let express = require('express');
const httpStatusCodes = require("http-status-codes");
let bodyParser = require("body-parser");
let { body, query, validationResult } = require('express-validator/check');
let bottles = require("../data/bottles.json");
let ConnectSequence = require('connect-sequence');
let ConflictError = require("../errorTypes/ConflictError.js");
let UnprocessableEntityError = require("../errorTypes/UnprocessableEntityError.js");
let IDNotFoundError = require("../errorTypes/IDNotFoundError.js");
let BadQueryError = require("../errorTypes/BadQueryError.js");

// const getValidateBottleFunction = require("../bodyValidation/bottleValidation.js");
/* Query Validation */
const queryValidator = require("../validators/queryValidator.js");
const filteringQueryValidations = require("../queryValidationData/filteringQueryValidation.js");

/* Body Validation */
const bodyValidator = require("../validators/bodyValidator.js");
const bottleBodyValidations = require("../bodyValidationData/bottleBodyValidation");

let router = express.Router();

bottles = bottles.map(bottle => addLinksToBottle(
    bottle,
    [
        ["self", concatURLs("/api/v1/bottles", bottle.id)]
    ]
));

router.use(bodyParser.json());

router.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        res.status(httpStatusCodes.BAD_REQUEST)
            .send("Invalid JSON syntax.");
    }
});

function* generateNextBottleID(startID) {
    let currentID = startID;

    while (true) {
        yield String(currentID++);
    }
}

const IDGenerator = generateNextBottleID(9);

router.route("/")
    .post((req, res, next) => {
        new ConnectSequence(req, res, next)
            .append(Array.isArray(req.body) ? bottlesListValidations : bottleValidations)
            .run();
    })
    .put((req, res, next) => {
        new ConnectSequence(req, res, next)
            .append(Array.isArray(req.body) ? bottlesListValidations : bottleValidations)
            .run();
    });

const propertiesToValidate = {
    POST: () => {
        let properties = Object.keys(properBottleObject);
        properties.splice(properties.indexOf("id"), 1);

        return properties;
    },
    PUT: (bottle) => {
        let properties = Object.keys(bottle).filter(
            property => Object.keys(properBottleObject).includes(property)
        );

        properties.unshift("id");

        return properties;
    }
}

function bottleValidations(req, res, next) {
    res.locals.errors = [];
    let properties = propertiesToValidate[req.method](req.body);

    let validateBottle = getValidateBottleFunction(properties);

    appendErrorIfNotEmpty(res, validateBottle(req.body));

    next();
}

function appendErrorIfNotEmpty(res, errorObj) {
    if (Object.keys(errorObj).length) {
        res.locals.errors.push(errorObj);
    }
}

function bottlesListValidations(req, res, next) {
    let validateBottles = validateBottlesFunction[req.method];

    validateBottles(req, res, next);

    // Filter out empty error objects.
    res.locals.errors = res.locals.errors.filter(
        error => Object.keys(error).length
    );

    next();
}


const validateBottlesFunction = {
    POST: (req, res) => {
        // In POST, bottles in body must have all properties except for ID.
        res.locals.errors = [];
        let properties = propertiesToValidate.POST();
        let validateBottle = getValidateBottleFunction(properties);
//TODO start using new class!
        req.body.forEach(
            (bottle, index) => {
                let bottleError = validateBottle(bottle, index);
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
                let validateBottle = getValidateBottleFunction(properties);

                let bottleError = validateBottle(bottle, index);
                appendErrorIfNotEmpty(res, bottleError);
            }
        )

        const conflictingID = findConflictingIDInList(req.body);

        if (conflictingID !== "") {
            next(new ConflictError(conflictingID));
        }
    }
}

function findConflictingIDInList(list) {
    let IDs = new Map();
    let hasIDConflict = false;
    let conflictingID = "";

    // Check for ID conflicts.
    for (let index = 0;
        !hasIDConflict && (index < list.length);
        index++) {
        if (IDs.has(list[index].id)) {
            hasIDConflict = true;
            conflictingID = list[index].id;
        } else {
            IDs.set(list[index].id, 0);
        }
    }

    return conflictingID;
}

const properBottleObject = {
    "id": "1",
    "creationDate": "2017-11-01",
    "orderID": "1",
    "factoryID": "1"
};

function getObjectWithoutLinks(obj) {
    let newObject = Object.assign({}, obj);
    delete newObject.links;

    return newObject;
}

function isInSortFormat(value) {
    let field = value.replace(/^(\+|-)/, "");

    return Object.keys(properBottleObject).includes(field);
}

// const queryValidations = [
//     query("fields")
//         .optional()
//         .isIn(Object.keys(properBottleObject))
//         .withMessage("Needs to be one or more real fields."),
//     query(["offset", "limit"])
//         .optional()
//         .isNumeric()
//         .withMessage("Needs to be an integer."),
//     query("sort")
//         .optional()
//         .custom(isInSortFormat)
//         .withMessage("Needs to be either <field_name>, +<field_name>, -<field_name>.")
// ];


const filteringQueryValidator =
    new queryValidator(
        filteringQueryValidations(
            Object.keys(properBottleObject)
        )
    );

function queryValidations(req, res, next) {
    res.locals.errors = [];
    const queryError = filteringQueryValidator.validateQuery(req.query);

    appendErrorIfNotEmpty(res, queryError);

    next()
}

// example route: /api/v1/bottles?sort=-id,creationDate,\+factoryID&fields=id,orderID,factoryID&offset=-2&limit=1
// Route sorts by descending id, ascending creationDate
// and factoryID, displays id, orderID
// and factoryID fields and gets only the second last object.
router.get("/", queryValidations, (req, res, next) => {
    if (res.locals.errors.length) {
        next(new BadQueryError(res.locals.errors));
    } else {
        let { offset, limit, fields, sort } = req.query;

        sort = (sort === undefined) ? [] : sort.split(",");
        offset = (offset === undefined) ? 0 : parseInt(offset);
        limit = (limit === undefined) ? bottles.length - offset : parseInt(limit);
        fields = (fields === undefined) ? undefined : fields.split(",");

        let sortedBottles = sortByField(bottles.slice(), sort);

        let rangedBottles = sortedBottles.slice(offset, offset + limit);

        let bottlesWithSelectedFields =
            fields ?
                getListWithSelectedFields(rangedBottles, fields)
                : rangedBottles;

        res.json(bottlesWithSelectedFields);
    }
});

function sortByField(list, sortFields) {
    let sortedList = list.slice().reverse();

    for (sortField of sortFields) {
        let field = sortField.replace(/^(\+|-)/, "");

        sortedList.sort(
            getCompareItemByFieldFunction(
                field,
                field === "creationDate",
                !sortField.startsWith("-")
            )
        );
    }

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
            let { value1, value2 } = getValues(item1, item2, field, isDate);

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
            let { value1, value2 } = getValues(item1, item2, field, isDate);

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

function getValues(item1, item2, field, isDate) {
    let value1 = item1[field];
    let value2 = item2[field];

    if (isDate) {
        value1 = new Date(value1);
        value2 = new Date(value2);
    }

    return {
        value1: value1,
        value2: value2
    }
}

router.param("id", (req, res, next) => {
    res.locals.indexOfBottleByID =
        getIndexOfBottleByID(req.params.id);

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

function getBottleToAdd(bottle) {
    return {
        id: IDGenerator.next().value,
        creationDate: bottle.creationDate,
        orderID: bottle.orderID,
        factoryID: bottle.factoryID
    };
}

router.post("/",
    (req, res, next) => {
        if (res.locals.errors.length) {
            next(new UnprocessableEntityError(res.locals.errors));
        } else {
            const bottlesToAdd = req.body instanceof Array ? req.body : [req.body];

            for (let bottleIndex = 0; bottleIndex < bottlesToAdd.length; bottleIndex++) {
                let bottleToAdd = getBottleToAdd(bottlesToAdd[bottleIndex]);
                bottleToAdd = addLinksToBottle(
                    bottleToAdd,
                    [
                        ["self", concatURLs(req.originalUrl, bottleToAdd.id)]
                    ]);

                bottles.push(bottleToAdd);
            }

            res.status(httpStatusCodes.CREATED).send();
        }
    }
);

router.put("/",
    (req, res, next) => {
        if (res.locals.errors.length) {
            next(new UnprocessableEntityError(res.locals.errors));
        } else {
            let bottlesFromBody = req.body instanceof Array ? req.body : [req.body];
            let error;

            for (let bottleIndex = 0;
                error === undefined && bottleIndex < bottlesFromBody.length;
                bottleIndex++) {
                let indexOfBottleToModify =
                    getIndexOfBottleByID(
                        bottlesFromBody[bottleIndex].id
                    );

                if (indexOfBottleToModify === -1) {
                    error = new IDNotFoundError(indexOfBottleToModify.id);
                } else {
                    let bottleToModify = bottles[indexOfBottleToModify];
                    let bottleFromBody = bottlesFromBody[bottleIndex];

                    updateObject(bottleToModify, bottleFromBody)
                }
            }

            if (error === undefined) {
                res.send();
            } else {
                next(error);
            }
        }
    }
);

function updateObject(objToUpdate, objWithUpdates) {
    for (prop in objToUpdate) {
        if (objWithUpdates[prop] !== undefined) {
            objToUpdate[prop] = objWithUpdates[prop];
        }
    }
}

router.use("/", (err, req, res, next) => {
    res.status(err.httpErrorCode).send(err.errorJSON);
});

function concatURLs(url1, url2) {
    return `${url1.replace(/\/*$/, "/")}${url2}`;
}

function getIndexOfBottleByID(id) {
    return bottles.findIndex(
        bottle => bottle.id === id
    );
}

// param: linkDataToAdd - A list of lists, 
// where each inner list has the format: [rel, href].
function addLinksToBottle(obj, linkDataToAdd) {
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

module.exports.router = router;