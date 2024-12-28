const jwt = require("jsonwebtoken");

const JWT = require("../../../../src/common/utils/JWT");

jest.mock("jsonwebtoken");

describe("JWT Class", () => {
  let jwtInstance;

  beforeAll(() => {
    process.env.JWT_SECRET = "secret";
    process.env.JWT_EXPIRATION = "1h";

    jwtInstance = new JWT();
  });

  describe("sign method", () => {
    it("should return a token when given a valid user object", () => {
      const user = { _id: "mockedmongodbobjectid" };

      jwt.sign.mockReturnValue("mocked.jsonweb.token");
      const token = jwtInstance.sign(user);

      expect(token).toBe("mocked.jsonweb.token");
    });
  });

  describe("verify method", () => {
    it("should return a user object when given a valid token", () => {
      const token = "mocked.jsonweb.token";

      jwt.verify.mockReturnValue({ id: "mockedmongodbobjectid" });
      const user = jwtInstance.verify(token);

      expect(user).toEqual({ id: "mockedmongodbobjectid" });
    });
  });
});
