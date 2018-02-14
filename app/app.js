const express = require("express");
const httpStatusCodes = require("http-status-codes");
const bodyParser = require("body-parser");
import bottlesRouter from "../routers/bottlesRouter.js";
// var bottleTypesRouter = require("../routers/bottleTypesRouter.js").router;

let app = express();

app.use("/", (req, res, next) => {
    console.log("Request received.");
    next();
});

app.use(bodyParser.json());

app.use("/", (req, res, next) => {
    if (req.get("content-type") !== undefined &&
        !req.is("application/json")) {
        res.status(httpStatusCodes.UNSUPPORTED_MEDIA_TYPE)
            .send("API only supports content type: application/json");
    } else {
        next();
    }
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        res.status(httpStatusCodes.BAD_REQUEST)
            .send("Invalid JSON syntax.");
    }
});

app.use("/api/v1/bottles", bottlesRouter);
// app.use("/api/v1/bottletypes", bottleTypesRouter);

app.use("/", (err, req, res, next) => {
    console.log(`Time: ${new Date()}`);
    console.log(`err.message: ${err.message}`);
    console.log(`${err.stack !== undefined ? "stack: " + err.stack : ""}`);

    if (err.httpErrorCode !== undefined) {
        res.status(err.httpErrorCode).send(err.errorJSON);
    } else {
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send("Oops, server error...");
    }
});


app.use((req, res, next) => {
    res.status(httpStatusCodes.NOT_FOUND).send("This is not a route.");
});

app.listen(3000);