const AuthServices = require("../services/auth.services");

const BaseController = require("../../../../common/controllers/base.controller");
const AsyncErrorHandler = require("../../../../common/utils/AsyncErrorHandler");

class AuthController extends BaseController {
  constructor() {
    super();

    this.authServices = new AuthServices();
  }

  signUp = AsyncErrorHandler(async (req, res) => {
    const user = await this.authServices.signUp(req);
    user.password = undefined;

    this.created(res, "Signed up successfully", { user });
  });

  signIn = AsyncErrorHandler(async (req, res) => {
    const [user, token] = await this.authServices.signIn(req);
    user.password = undefined;

    this.ok(res, "Signed in successfully", { user, token });
  });

  protect = AsyncErrorHandler(async (req, res, next) => {
    const user = await this.authServices.protect(req);

    req.user = user;

    next();
  });

  restrict = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return this.forbidden(res);
      }

      next();
    };
  };
}

module.exports = AuthController;
