const HttpStatusCode = require("../constants/HttpStatusCode");
const ResponseStatus = require("../constants/ResponseStatus");

const CustomError = require("../utils/CustomError");

class ErrorController {
  #developmentResponse = (res, error) => {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stackTrace: error.stack,
      error,
    });
  };

  #productionResponse = (res, error) => {
    if (error.name === "CastError") error = this.#castErrorHandler(error);
    if (error.code === 11000) error = this.#duplicateKeyErrorHandler(error);
    if (error.name === "ValidationError")
      error = this.#validationErrorHandler(error);
    if (error.name === "TokenExpiredError")
      error = this.#tokenExpiredErrorHandler(error);
    if (error.name === "JsonWebTokenError")
      error = this.#jsonWebTokenErrorHandler(error);

    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: ResponseStatus.ERROR,
        message: "Something went wrong! Please, try again later.",
      });
    }
  };

  #castErrorHandler = (err) => {
    const msg = `Invalid value for ${err.path}: ${err.value}`;
    return new CustomError(HttpStatusCode.BAD_REQUEST, msg);
  };

  #duplicateKeyErrorHandler = (err) => {
    const msg = `Duplicate value for ${Object.keys(err.keyValue)}`;
    return new CustomError(HttpStatusCode.BAD_REQUEST, msg);
  };

  #validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map((val) => val.message);
    const errorMessages = errors.join(". ");
    const msg = `Invalid input data: ${errorMessages}`;
    return new CustomError(HttpStatusCode.BAD_REQUEST, msg);
  };

  #tokenExpiredErrorHandler = (err) => {
    const msg = "Token has expired. Please, login again!";
    return new CustomError(HttpStatusCode.UNAUTHORIZED, msg);
  };

  #jsonWebTokenErrorHandler = (err) => {
    const msg = "Invalid token. Please, login again!";
    return new CustomError(HttpStatusCode.UNAUTHORIZED, msg);
  };

  handleGlobalError = (error, req, res, next) => {
    error.statusCode = error.statusCode ?? HttpStatusCode.INTERNAL_SERVER_ERROR;
    error.status = error.status ?? ResponseStatus.ERROR;

    if (process.env.NODE_ENV === "development") {
      this.#developmentResponse(res, error);
    } else {
      this.#productionResponse(res, error);
    }
  };

  handleUncaughtException = (error) => {
    console.log("Uncaught exception occured! shutting down..");
    console.log(error.name, error.message);

    process.exit(1);
  };

  handleUnhandledRejection = (error, server) => {
    console.log("Unhandled rejection occured! shutting down..");
    console.log(error.name, error.message);

    server.close(() => {
      process.exit(1);
    });
  };

  handleNotFoundRoute = (req, res, next) => {
    throw new CustomError(
      HttpStatusCode.NOT_FOUND,
      `Can't find ${req.originalUrl} on this server!`
    );
  };
}

module.exports = ErrorController;
