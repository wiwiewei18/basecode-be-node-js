const ResponseStatus = require("../constants/ResponseStatus");

class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status =
      statusCode >= 400 && statusCode < 500
        ? ResponseStatus.FAIL
        : ResponseStatus.ERROR;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
