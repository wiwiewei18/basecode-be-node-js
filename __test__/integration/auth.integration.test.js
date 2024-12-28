const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const app = require("../../app");

describe("Auth Router", () => {
  let mongoDBMemoryServer;

  beforeAll(async () => {
    process.env.NODE_ENV = "production";
    process.env.JWT_SECRET = "himitsu";
    process.env.JWT_EXPIRATION = 604800000;

    mongoDBMemoryServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoDBMemoryServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();

    await mongoDBMemoryServer.stop();
  });

  describe("POST /api/v1/auth/sign-up", () => {
    it(`should return 201 and created user data when given a valid payload`, async () => {
      const payload = {
        name: "kuro",
        email: "kuro@mail.com",
        password: "12345678",
        confirmPassword: "12345678",
      };

      const { statusCode, body } = await supertest(app)
        .post("/api/v1/auth/sign-up")
        .send(payload);

      expect(statusCode).toBe(201);
      expect(body.status).toBe("success");
      expect(body.message).toBe("Signed up successfully");
      expect(body.data).toEqual({
        user: {
          name: payload.name,
          role: "user",
          email: payload.email,
          deleted: false,
          _id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: 0,
        },
      });
    });

    it(`should return 400 and "Duplicate value for email" error message when given an invalid payload (existing email)`, async () => {
      const payload = {
        name: "kuro",
        email: "kuro@mail.com",
        password: "12345678",
        confirmPassword: "12345678",
      };

      const { statusCode, body } = await supertest(app)
        .post("/api/v1/auth/sign-up")
        .send(payload);

      expect(statusCode).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toContain("Duplicate value for email");
    });

    it(`should return 400 and "Please enter a valid email" error message when given an invalid payload (invalid email format)`, async () => {
      const payload = {
        name: "kuro",
        email: "invalidemailformat",
        password: "12345678",
        confirmPassword: "12345678",
      };

      const { statusCode, body } = await supertest(app)
        .post("/api/v1/auth/sign-up")
        .send(payload);

      expect(statusCode).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toContain("Please enter a valid email");
    });

    it(`should return 400 and "Minimum password length is 8 characters" error message when given an invalid payload (password less than 8 characters)`, async () => {
      const payload = {
        name: "kuro",
        email: "kuro@mail.com",
        password: "1234567",
        confirmPassword: "1234567",
      };

      const { statusCode, body } = await supertest(app)
        .post("/api/v1/auth/sign-up")
        .send(payload);

      expect(statusCode).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toContain("Minimum password length is 8 characters");
    });

    it(`should return 400 and "Password and ConfirmPassword do not match" error message when given an invalid payload (password and confirm password do not match)`, async () => {
      const payload = {
        name: "kuro",
        email: "kuro@mail.com",
        password: "12345678",
        confirmPassword: "unmatchedpassword",
      };

      const { statusCode, body } = await supertest(app)
        .post("/api/v1/auth/sign-up")
        .send(payload);

      expect(statusCode).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toContain(
        "Password and ConfirmPassword do not match"
      );
    });

    it(`should return 400 and "Please confirm your password. Please enter your password. Please enter your email. Please enter your name" error message when given an invalid payload (empty)`, async () => {
      const payload = {};

      const { statusCode, body } = await supertest(app)
        .post("/api/v1/auth/sign-up")
        .send(payload);

      expect(statusCode).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toContain(
        "Please confirm your password. Please enter your password. Please enter your email. Please enter your name"
      );
    });
  });

  describe("POST /api/v1/auth/sign-in", () => {
    it(`should return 200, signed in user data and token when given a valid payload`, async () => {
      const payload = {
        email: "kuro@mail.com",
        password: "12345678",
      };

      const { statusCode, body } = await supertest(app)
        .post("/api/v1/auth/sign-in")
        .send(payload);

      expect(statusCode).toBe(200);
      expect(body.status).toBe("success");
      expect(body.message).toBe("Signed in successfully");
      expect(body.data).toEqual({
        user: {
          _id: expect.any(String),
          name: "kuro",
          role: "user",
          email: "kuro@mail.com",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        token: expect.any(String),
      });
    });

    it(`should return 400 and "Please enter email and password" error message when given an invalid payload (empty)`, async () => {
      const payload = {};

      const { statusCode, body } = await supertest(app)
        .post("/api/v1/auth/sign-in")
        .send(payload);

      expect(statusCode).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toContain("Please enter email and password");
    });

    it(`should return 400 and "Incorrect email or password" error message when given an invalid payload (non-existing email)`, async () => {
      const payload = {
        email: "non-existingemail",
        password: "12345678",
      };

      const { statusCode, body } = await supertest(app)
        .post("/api/v1/auth/sign-in")
        .send(payload);

      expect(statusCode).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toContain("Incorrect email or password");
    });

    it(`should return 400 and "Incorrect email or password" error message when given an invalid payload (wrong password)`, async () => {
      const payload = {
        email: "kuro@mail.com",
        password: "wrongpassword",
      };

      const { statusCode, body } = await supertest(app)
        .post("/api/v1/auth/sign-in")
        .send(payload);

      expect(statusCode).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toContain("Incorrect email or password");
    });
  });
});
