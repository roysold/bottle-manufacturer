let express = require('express');
let httpStatusCodes = require("http-status-codes");
let bodyParser = require("body-parser");
let { body, validationResult } = require('express-validator/check');
let router = express.Router();
let bottles = require("../data/bottles.json");

bottles = bottles.map(bottle => addLinksToBottle(
    bottle,
    [
        ["self", concatURLs("/api/v1/bottles", bottle.id)]
    ]
));

router.use(bodyParser.json());

router.use(function (err, req, res, next) {
    if (err instanceof SyntaxError) {
        res.status(httpStatusCodes.BAD_REQUEST)
            .send("Invalid JSON syntax.");
    }
});

//sort=-manufactorer,+model
// fields=manufacturer,model,id,color
// offset=10&limit=5
// { sort: '-manufactorer, model',
//   fields: 'manufacturer,model,id,color',
//   offset: '10',
//   limit: '5' }

router.get("/", (req, res) => {
    console.log(req.query);
    let bottlesToSend = [];
    let { offset, limit, fields, sort } = req.query;

    offset = (offset === undefined) ? 0 : parseInt(offset);
    limit = (limit > bottles.length - offset) ? bottles.length - offset : parseInt(limit);
    fields = (fields === undefined) ? Object.keys(bottles[0]) : fields.split(",");
    sort = (sort === undefined) ? [] : sort.split(",");

    let bottlesToSort = sortList(bottles, sort);

    //TODO
    for (let index = offset; index < offset + limit; index++) {
        bottlesToSend.push({});
    }

    bottlesToSend = bottles.map(bottle => {
        let bottleToReturn = {};

    })

    res.json(bottles);
});

//TODO
function sortList(list, sortFields) {
    let sortedList = list.slice();

    sortFields.forEach(field => {
        if (field.startsWith("+")) {
            sortedList.sort((item1, item2) => {

            })
        }
    })
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

// TODO validate that we don't get any extra unwanted properties
const bottleValidations = [
    body(["id", "orderID", "factoryID"])
        .isAlphanumeric()
        .withMessage('Field is required. Must be a string. Must not be empty.'),
    body("creationDate")
        .isISO8601()
        .withMessage('Field is required and must be in ISO8601 format.')
];

// TODO change properties or delete and add new object each time?
router.put("/", bottleValidations,
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
    });

function concatURLs(url1, url2) {
    return `${url1.replace(/\/*$/, "/")}${url2}`
}

router.post("/", bottleValidations,
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
    });

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