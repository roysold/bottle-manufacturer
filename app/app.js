var express = require("express");
var bottlesRouter = require("../routers/bottlesRouter.js").router;
const httpStatusCodes = require("http-status-codes");
let bodyParser = require("body-parser");

let app = express();

app.use(bodyParser.json());

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        res.status(httpStatusCodes.BAD_REQUEST)
            .send("Invalid JSON syntax.");
    }
});

app.use("/api/v1/bottles", bottlesRouter);

app.listen(3000);