const jwt = require("jsonwebtoken");

class JWT {
  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.expiration = process.env.JWT_EXPIRATION;
    this.jwt = jwt;
  }

  sign = (user) => {
    return this.jwt.sign({ id: user._id }, this.secret, {
      expiresIn: this.expiration,
    });
  };

  verify = (token) => {
    return this.jwt.verify(token, this.secret);
  };
}

module.exports = JWT;
