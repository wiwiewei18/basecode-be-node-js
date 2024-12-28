const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const sanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const authRouter = require("./src/modules/auth/v1/routes/auth.routes");
const userRouter = require("./src/modules/user/v1/routes/user.routes");

const ErrorController = require("./src/common/controllers/error.controller");
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

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

app.all("*", errorController.handleNotFoundRoute);

app.use(errorController.handleGlobalError);

module.exports = app;
