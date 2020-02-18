var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
// var lessMiddleware = require("less-middleware");
var logger = require("morgan");

var indexRouter = require("./routes/index");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(lessMiddleware(path.join(__dirname, "front/build")));
app.use(express.static(path.join(__dirname, "front/build")));
// app.use(lessMiddleware(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

module.exports = app;
