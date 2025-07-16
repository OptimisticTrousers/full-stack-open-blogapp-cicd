const config = require("./utils/config");
const express = require("express");
const mongoose = require("mongoose");
require("express-async-errors");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const loginRouter = require("./controllers/login");

const app = express();

app.use(express.static("dist"));

const mongoUrl = config.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(mongoUrl);

app.use(express.json());

app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.get("/health", (req, res) => {
  res.send("ok");
});

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
