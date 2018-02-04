let express = require('express');
const httpStatusCodes = require("http-status-codes");
let bodyParser = require("body-parser");
let { body, query, validationResult } = require('express-validator/check');
const validator = require("validator");
let bottles = require("../data/bottles.json");
let ConnectSequence = require('connect-sequence');

// let DynamicMiddleWare = require('dynamic-middleware');
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


// let validationsDynamicMiddleware = DynamicMiddleWare.create(testValidations);

// TODO validate that we don't get any extra unwanted properties
function bottleValidations(req, res, next) {
    res.locals.errors = [];
    res.locals.errors.push(validateBottle(req.body));

    next();
}

function bottlesListValidations(req, res, next) {
    res.locals.errors = [];
    let ids = new Map();
    let hasIdConflict = false;

    // Check for ID conflicts.
    for (let bottleIndex = 0; !hasIdConflict && bottleIndex < req.body.length; bottleIndex++) {
        if (ids.has(bottle.id)) {
            hasIdConflict = true;
        } else {
            ids.set(bottle.id, 0);
        }
    }

    if (!hasIdConflict) {
        req.body.forEach(
            bottle => res.locals.errors.push(
                validateBottle(req.body)
            )
        );

        // Filter out empty objects.
        res.locals.errors = res.locals.errors.filter(
            error => Object.keys(error).length
        );

        next();
    } else {
        next(new ConflictError("Conflicting IDs in list."));
    }
}

class ConflictError extends Error {
    constructor(message) {
        super(message);
    }
}

function validateBottle(bottle, index) {
    let errorObj = {};
    let alphanumericPropertiesToValidate = ["id", "orderID", "factoryID"];

    alphanumericPropertiesToValidate.forEach(property => {
        if (!isString(property) ||
            !validator.isAlphanumeric(id)) {
            addError(
                property,
                bottle[property] === undefined ? "" : bottle[property],
                "ID is required. Must be a string. Must not be empty."
            );
        }
    });

    if (!isString(creationDate) ||
        !validator.isISO8601(creationDate)) {
        addError(
            "creationDate",
            creationDate === undefined ? "" : creationDate,
            "Field is required and must be in ISO8601 format."
        );
    }

    (function hasCorrectProperties(objToCheck, properObj) {
        for (property in objToCheck) {
            if (!Object.keys(properObj).includes(property)) {
                addError(property, objToCheck[property], `${value} is not a property`)
            }
        }
    })(bottle, properBottleObject);

    function isString(value) {
        return typeof value === "string";
    }

    function addError(property, value, msg) {
        errorObj.errors[property] = {
            location: `body[${index}]`,
            value: value,
            msg: msg
        }
    }

    return errorObj;
}

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



router.use("/", (req, res, next) => {
    new ConnectSequence(req, res, next)
        .append(req.body instanceof Array ? bottlesListValidations : bottleValidations)
        .run();
});

let properBottleObject = getObjectWithoutLinks(bottles[0]);

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
router.get("/", queryValidations, (req, res) => {
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
    } else { // TODO send to next(err)?
        res.status(httpStatusCodes.BAD_REQUEST)
            .json({ errors: errors.mapped() });
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

router.post("/",
    (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {

            if (getIndexOfBottleByID(req.body.id) !== -1) {
                res.status(httpStatusCodes.CONFLICT)
                    .json(
                    {
                        error: `A bottle with the ID '${req.body.id}' already exists.`
                    }
                    )
            } else {
                bottles.push(addLinksToBottle(
                    req.body,
                    [
                        ["self", concatURLs(req.originalUrl, req.body.id)]
                    ]
                )
                );

                res.status(httpStatusCodes.CREATED).send();
            }
        } else {
            sendUnprocessableEntityError(errors, res);
        }
    }
);

router.put("/",
    (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            let indexOfBottleToModify = getIndexOfBottleByID(req.body.id);

            if (indexOfBottleToModify !== -1) {
                bottles.splice(indexOfBottleToModify, 1,
                    addLinksToBottle(
                        req.body,
                        [
                            ["self", concatURLs(req.originalUrl, req.body.id)]
                        ]
                    )
                );

                res.send();
            } else {
                res.status(httpStatusCodes.BAD_REQUEST);
                sendBottleIDNotFoundError(req.body.id, res);
            }
        } else {
            sendUnprocessableEntityError(errors, res);
        }
    }
);

// TODO send errors object, add errors object as property of ConflictError.
router.use("/", (err, req, res, next) => {
    if (err instanceof ConflictError) {
        res.status(httpStatusCodes.CONFLICT).send(err.message);
    } else {
        next();
    }
});

function concatURLs(url1, url2) {
    return `${url1.replace(/\/*$/, "/")}${url2}`;
}

function getIndexOfBottleByID(id) {
    return bottles.findIndex(
        bottle => bottle.id === id
    );
}

function sendBottleIDNotFoundError(id, res) {
    res.json(
        {
            error: `No bottle with the ID '${id}'.`
        }
    );
}

function sendUnprocessableEntityError(errors, res) {
    res.status(httpStatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.mapped() });
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

module.exports = router;