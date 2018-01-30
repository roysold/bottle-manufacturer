let express = require('express');
let httpStatusCodes = require("http-status-codes");
let bodyParser = require("body-parser");
let { body, validationResult } = require('express-validator/check');
let router = express.Router();
let bottles = require("../data/bottles.json");

router.use(bodyParser.json());

router.use(function (err, req, res, next) {
    if (err instanceof SyntaxError) {
        res.status(httpStatusCodes.BAD_REQUEST)
            .send("Invalid JSON syntax.");
    }
});

router.get("/", (req, res) => {
    res.json(bottles);
})

router.param("id", (req, res, next) => {
    res.locals.indexOfBottleByID =
        getIndexOfBottleByID(req.params.id);

    res.locals.indexOfBottleByID === -1 ?
        sendBottleIDNotFoundError(req, res)
        : next();
});

router.route("/:id")
    .get((req, res) => {
        res.json(bottles[res.locals.indexOfBottleByID]);
    })
    .delete((req, res) => {
        bottles.splice(res.locals.indexOfBottleByID, 1);

        res.status(httpStatusCodes.ACCEPTED)
            .send("Bottle deleted.");
    });

const bottleValidations = [
    body(["id", "orderID", "factoryID"])
        .isAlphanumeric()
        .withMessage('Field is required. Must be a string. Must not be empty.'),
    body("creationDate")
        .isISO8601()
        .withMessage('Field is required and must be in ISO8601 format.')
];

router.put("/", bottleValidations,
    (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            let indexOfBottleToModify = getIndexOfBottleByID(req.body.id);

            if (indexOfBottleToModify !== -1) {
                bottles.splice(indexOfBottleToModify, 1, req.body);

                res.send();
            } else {
                res.status(httpStatusCodes.BAD_REQUEST);
                sendBottleIDNotFoundError(req.body.id, res);
            }
        } else {
            sendUnprocessableEntityError(errors, res);
        }
    });

router.post("/", bottleValidations,
    (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            if (getIndexOfBottleByID(req.body.id) !== -1) {
                res.status(httpStatusCodes.CONFLICT)
                    .json(
                    {
                        error: "A bottle with the ID '"
                        + req.body.id
                        + "' already exists."
                    }
                    )
            } else {
                bottles.push(req.body);

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
            error: "No bottle with the ID '" + id + "'."
        }
    );
}

function sendUnprocessableEntityError(errors, res) {
    res.status(httpStatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.mapped() });
}

module.exports = router;