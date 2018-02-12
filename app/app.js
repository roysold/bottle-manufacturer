const express = require("express");
const httpStatusCodes = require("http-status-codes");
const bodyParser = require("body-parser");
const bottlesRouter = require("../routers/bottlesRouter.js");
// var bottleTypesRouter = require("../routers/bottleTypesRouter.js").router;

let app = express();

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
    res.status(err.httpErrorCode).send(err.errorJSON);
});


app.use((req, res, next) => {
    res.status(httpStatusCodes.NOT_FOUND).send("This is not a route.");
});

app.listen(3000);