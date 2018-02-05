let express = require('express');
const httpStatusCodes = require("http-status-codes");
let bodyParser = require("body-parser");
let { body, query, validationResult } = require('express-validator/check');
const validator = require("validator");
let bottles = require("../data/bottles.json");
let ConnectSequence = require('connect-sequence');
let ConflictError = require("../errorTypes/ConflictError.js");
let UnprocessableEntityError = require("../errorTypes/UnprocessableEntityError.js");
let IDNotFoundError = require("../errorTypes/IDNotFoundError.js");
let BadQueryError = require("../errorTypes/BadQueryError.js");
let router = express.Router();
const getValidateBottleFunction = require("../bottlesValidation/bottleValidation.js");

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

// ERROR FORMAT
// {
//     "errors": {
//         "limit": {
//             "location": "query",
//             "param": "limit",
//             "value": "23ds",
//             "msg": "Needs to be an integer."
//         },
//         "sort": {
//             "location": "query",
//             "param": "sort",
//             "value": "+factoryIDdsas",
//             "msg": "Needs to be either <field_name>, +<field_name>, -<field_name>."
//         }
//     }
// }

router.route("/")
    .post((req, res, next) => {
        new ConnectSequence(req, res, next)
            .append(req.body instanceof Array ? bottlesListValidations : bottleValidations)
            .run();
    })
    .put((req, res, next) => {
        new ConnectSequence(req, res, next)
            .append(req.body instanceof Array ? bottlesListValidations : bottleValidations)
            .run();
    });

function bottleValidations(req, res, next) {
    res.locals.errors = [];
    let propertiesToValidate;

    if (req.method === "POST") {
        propertiesToValidate = getPropertiesToValidateForPOSTBody();
    } else if (req.method === "PUT") {
        propertiesToValidate = getPropertiesToValidateForPUTBody(req.body);
    }

    let validateBottle = getValidateBottleFunction(propertiesToValidate);

    appendErrorIfNotEmpty(res, validateBottle(req.body));

    next();
}

function appendErrorIfNotEmpty(res, errorObj) {
    if (Object.keys(errorObj).length) {
        res.locals.errors.push(errorObj);
    }
}

function getPropertiesToValidateForPOSTBody() {
    let properties = Object.keys(properBottleObject);
    properties.splice(properties.indexOf("id"), 1);

    return properties;
}

function getPropertiesToValidateForPUTBody(bottle) {
    let properties = Object.keys(bottle).filter(
        property => Object.keys(properBottleObject).includes(property)
    );

    properties.unshift("id");

    return properties;
}

// function propertiesToValidateFunctionByHTTPMethod(req) {
//     if (req.method === "POST") {
//         return () => {
//             let properties = Object.keys(properBottleObject);
//             properties.splice(properties.indexOf("id"), 1);

//             return properties;
//         }
//     } else if (req.method === "PUT") {
//         return (bottle) => Object.keys(bottle).filter(
//             property => Object.keys(properBottleObject).includes(property)
//         );
//     }
// }

function bottlesListValidations(req, res, next) {
    let validateBottles = validateBottlesFunctionByHTTPMethod(req.method);

    validateBottles(req, res, next);

    // Filter out empty error objects.
    res.locals.errors = res.locals.errors.filter(
        error => Object.keys(error).length
    );

    next();
}

function validateBottlesFunctionByHTTPMethod(method) {
    if (method.toUpperCase() === "POST") {
        return (req, res) => {
            res.locals.errors = [];
            let propertiesToValidate = getPropertiesToValidateForPOSTBody();
            let validateBottle = getValidateBottleFunction(propertiesToValidate);

            // In POST, bottles in body must have all properties except for ID.
            req.body.forEach(
                (bottle, index) => {
                    let bottleError = validateBottle(bottle, index);
                    appendErrorIfNotEmpty(res, bottleError);
                }
            )
        }
    } else if (method.toUpperCase() === "PUT") {
        return (req, res, next) => {
            res.locals.errors = [];
            // In PUT, bottles in body don't require all properties, except ID.

            req.body.forEach(
                (bottle, index) => {
                    let propertiesToValidate = getPropertiesToValidateForPUTBody(bottle);
                    let validateBottle = getValidateBottleFunction(propertiesToValidate);

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
}

// function POSTPropertiesToValidate() {
//     let properties = Object.keys(properBottleObject);
//     properties.splice(properties.indexOf("ID"), 1);

//     return properties;
// }

// function PUTPropertiesToValidate(bottle) {
//     return Object.keys(bottle).filter(
//         property => Object.keys(properBottleObject).includes(property)
//     );
// }

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

const queryValidations = [
    query("fields")
        .optional()
        .isIn(Object.keys(properBottleObject))
        .withMessage("Needs to be one or more real fields."),
    query(["offset", "limit"])
        .optional()
        .isNumeric()
        .withMessage("Needs to be an integer."),
    query("sort")
        .optional()
        .custom(isInSortFormat)
        .withMessage("Needs to be either <field_name>, +<field_name>, -<field_name>.")
];

// example route: /api/v1/bottles?sort=-id,creationDate,\+factoryID&fields=id,orderID,factoryID&offset=-2&limit=1
// Route sorts by descending id, ascending creationDate
// and factoryID, displays id, orderID
// and factoryID fields and gets only the second last object.
router.get("/", queryValidations, (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        let { offset, limit, fields, sort } = req.query;

        sort = (sort === undefined) ? [] : sort.split(",");
        offset = (offset === undefined) ? 0 : parseInt(offset);
        limit = (limit === undefined) ? bottles.length - offset : parseInt(limit);
        fields = (fields === undefined) ? undefined : fields.split(",");

        let sortedBottles = bottles.slice();

        for (let index = sort.length - 1; index >= 0; index--) {
            let field = sort[index].replace(/^(\+|-)/, "");

            sortedBottles.sort(
                getCompareItemByFieldFunction(
                    field,
                    field === "creationDate",
                    !sort[index].startsWith("-")
                )
            );
        }

        let rangedBottles = sortedBottles.slice(offset, offset + limit);

        let manipulatedBottles =
            fields ?
                rangedBottles.map(
                    getObjectWithSelectedFieldsFunction(fields)
                )
                : rangedBottles;

        res.json(manipulatedBottles);
    } else {
        next(new BadQueryError({ errors: errors.mapped() }));
    }
});

// Try not returning a function
function getObjectWithSelectedFieldsFunction(fields) {
    return obj => {
        let objWithSelectedfields = {};

        fields.forEach(field => {
            objWithSelectedfields[field] = obj[field];
        });

        return objWithSelectedfields;
    }
}

function getCompareItemByFieldFunction(field, isDate, ascending) {
    let value1, value2;

    function setValues(item1, item2, field) {
        value1 = item1[field];
        value2 = item2[field];

        if (isDate) {
            value1 = new Date(value1);
            value2 = new Date(value2);
        }
    }

    if (!ascending) {
        return (item1, item2) => {
            setValues(item1, item2, field);

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
            setValues(item1, item2, field);

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
                    let bottleFromBody = bottlesFromBody[bottleIndex];
                    let bottleToModify = bottles[indexOfBottleToModify];

                    for (prop in properBottleObject) {
                        if (bottleFromBody[prop] !== undefined) {
                            bottleToModify[prop] = bottleFromBody[prop];
                        }
                    }
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

// function sendBottleIDNotFoundError(id, res) {
//     res.json(
//         {
//             error: `No bottle with the ID '${id}'.`
//         }
//     );
// }

// function sendUnprocessableEntityError(res, errorsJSON) {
//     res.status(httpStatusCodes.UNPROCESSABLE_ENTITY)
//         .json(errorsJSON);//{ errors: errors.mapped() }); TODO for query
// }

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