let express = require('express');
let httpStatusCodes = require("http-status-codes");
let bodyParser = require("body-parser");
let multer = require("multer");
let validator = require('express-validator');

let router = express.Router();
let bottles = require("../data/bottles.json");
let upload = multer();

router.use(bodyParser.json());

router.get("/", (req, res) => {
    res.json(bottles);
})

router.param("id", (req, res, next) => {
    res.locals.indexOfBottleByID = bottles.findIndex(
        bottle => bottle.id === req.params.id
    );

    res.locals.indexOfBottleByID === -1 ?
        res.send(`No bottle with the ID ${req.params.id}.`)
        : next();
});

router.route("/:id")
    .get((req, res) => {
        res.json(bottles[res.locals.indexOfBottleByID]);
    })
    .delete((req, res) => {
        bottles.splice(res.locals.indexOfBottleByID, 1);

        res.status(httpStatusCodes.NO_CONTENT)
            .send("Bottle deleted.");
    });

router.route("/")
    .put([upload.array()], (req, res) => {
        res.status(httpStatusCodes.ACCEPTED)
            .send("Bottle modified.");
    })
    .post()
module.exports = router;