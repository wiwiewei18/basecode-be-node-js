const HttpStatusCode = require("../constants/HttpStatusCode");
const ResponseStatus = require("../constants/ResponseStatus");

class BaseController {
  ok = (res, message = "Ok", data = {}) => {
    res.status(HttpStatusCode.OK).json({
      status: ResponseStatus.SUCCESS,
      message: message,
      data: data,
    });
  };

  created = (res, message = "Created", data = {}) => {
    res.status(HttpStatusCode.CREATED).json({
      status: ResponseStatus.SUCCESS,
      message: message,
      data: data,
    });
  };

  forbidden = (res, message = "Forbidden") => {
    res.status(HttpStatusCode.FORBIDDEN).json({
      status: ResponseStatus.FAIL,
      message: message,
    });
  };

  notFound = (res, message = "Not found") => {
    res.status(HttpStatusCode.NOT_FOUND).json({
      status: ResponseStatus.FAIL,
      message: message,
    });
  };
}

module.exports = BaseController;
