require("dotenv").config();
const mongoose = require("mongoose");

const ErrorController = require("./src/common/controllers/error.controller");
const errorController = new ErrorController();

process.on("uncaughtException", errorController.handleUncaughtException);

mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then((conn) => {
  console.log("Database connected");
});

const app = require("./app");

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on("unhandledRejection", (error) => {
  errorController.handleUnhandledRejection(error, server);
});
