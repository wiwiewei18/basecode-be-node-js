const User = require("../../../../common/models/user.model");
const HttpStatusCode = require("../../../../common/constants/HttpStatusCode");
const CustomError = require("../../../../common/utils/CustomError");
const JWT = require("../../../../common/utils/JWT");

class AuthService {
  constructor() {
    this.userModel = User;
  }

  signUp = async (req) => {
    return await this.userModel.create(req.body);
  };

  #validateSignInRequest = (req) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError(
        HttpStatusCode.BAD_REQUEST,
        "Please enter email and password"
      );
    }

    return;
  };

  signIn = async (req) => {
    const { email, password } = req.body;

    this.#validateSignInRequest(req);

    const user = await this.userModel.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      throw new CustomError(
        HttpStatusCode.BAD_REQUEST,
        "Incorrect email or password"
      );
    }

    return [user, new JWT().sign(user)];
  };

  #getToken = (req) => {
    const bearerToken = req.headers.authorization;
    let token;

    if (bearerToken && bearerToken.startsWith("Bearer ")) {
      token = bearerToken.split(" ")[1];
    }

    return token;
  };

  protect = async (req) => {
    const token = this.#getToken(req);

    if (!token) {
      throw new CustomError(
        HttpStatusCode.UNAUTHORIZED,
        "You are not logged in"
      );
    }

    const decodedToken = new JWT().verify(token);

    const user = await this.userModel.findById(decodedToken.id);

    if (!user) {
      throw new CustomError(
        HttpStatusCode.UNAUTHORIZED,
        "The user with the given token doesn't exist"
      );
    }

    if (user.isPasswordChanged(decodedToken.iat)) {
      throw new CustomError(
        HttpStatusCode.UNAUTHORIZED,
        "User recently changed password! Please log in again."
      );
    }

    return user;
  };
}

module.exports = AuthService;
