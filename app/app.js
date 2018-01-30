var express = require("express");
var bottlesRouter = require("../routers/bottlesRouter.js");

let app = express();

app.use("/api/v1/bottles", bottlesRouter);

app.listen(3000);