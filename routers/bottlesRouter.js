let express = require('express');
let httpStatusCodes = require("http-status-codes");

let router = express.Router();
let bottles = require("../data/bottles.json");

router.route("/:id")
    .get((req, res, next) => {
        res.json(bottles);
    })
    .put((req, res, next) => {
        res.status(httpStatusCodes.ACCEPTED).send("Bottle added.");
    })
    .post((req, res, next) => {
        res.status(httpStatusCodes.CREATED).send("Bottle added.");

    })
    .delete((req, res, next) => {
        res.status(httpStatusCodes.NO_CONTENT).send("Bottle deleted.");
    })

module.exports = router;