const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const sanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const authRouter = require("./src/routes/auth.routes");
const userRouter = require("./src/routes/user.routes");

const ErrorController = require("./src/controllers/error.controller");
const errorController = new ErrorController();

const app = express();

app.use(
  "/api",
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
  })
);
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(sanitize());
app.use(xss());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.all("*", errorController.handleNotFoundRoute);

app.use(errorController.handleGlobalError);

module.exports = app;
