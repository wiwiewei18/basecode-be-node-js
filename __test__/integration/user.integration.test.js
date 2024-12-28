const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const app = require("../../app");
const JWT = require("../../src/common/utils/JWT");
const AuthService = require("../../src/modules/auth/v1/services/auth.services");

describe("User Router", () => {
  let mongoDBMemoryServer;
  let jwt;

  beforeAll(async () => {
    process.env.NODE_ENV = "production";
    process.env.JWT_SECRET = "himitsu";
    process.env.JWT_EXPIRATION = 604800000;

    mongoDBMemoryServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoDBMemoryServer.getUri());

    const signedUpUser = await new AuthService().signUp({
      body: {
        name: "kuro",
        email: "kuro@mail.com",
        password: "12345678",
        confirmPassword: "12345678",
      },
    });

    jwt = new JWT().sign(signedUpUser);

    const toCreateUsers = [];
    for (let i = 1; i <= 3; i++) {
      toCreateUsers.push({
        name: `kuro${i}`,
        email: `kuro${i}@mail.com`,
        password: "12345678",
        confirmPassword: "12345678",
      });
      toCreateUsers.push({
        name: `shiro${i}`,
        email: `shiro${i}@mail.com`,
        password: "12345678",
        confirmPassword: "12345678",
      });
    }

    await new AuthService().signUp({ body: toCreateUsers });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();

    await mongoDBMemoryServer.stop();
  });

  describe("GET /api/v1/user/", () => {
    it(`should return 200 and all users data when given a valid param (empty)`, async () => {
      const { statusCode, body } = await supertest(app)
        .get("/api/v1/user/")
        .set("Authorization", `Bearer ${jwt}`);

      expect(statusCode).toBe(200);
      expect(body.status).toBe("success");
      expect(body.message).toBe("User list fetched successfully");
      expect(body.data.userList.length).toBe(7);
      expect(body.data).toEqual({
        userList: expect.arrayContaining([
          {
            _id: expect.any(String),
            email: expect.any(String),
            name: expect.any(String),
            role: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ]),
        count: 7,
      });
    });

    it(`should return 200 and 4 users data when given a valid param (page = 1, limit = 4)`, async () => {
      const { statusCode, body } = await supertest(app)
        .get("/api/v1/user/?page=1&limit=4")
        .set("Authorization", `Bearer ${jwt}`);

      expect(statusCode).toBe(200);
      expect(body.status).toBe("success");
      expect(body.message).toBe("User list fetched successfully");
      expect(body.data.userList.length).toBe(4);
      expect(body.data).toEqual({
        userList: expect.arrayContaining([
          {
            _id: expect.any(String),
            email: expect.any(String),
            name: expect.any(String),
            role: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ]),
        count: 7,
      });
    });

    it(`should return 200 and 3 users data when given a valid param (page = 2, limit = 4)`, async () => {
      const { statusCode, body } = await supertest(app)
        .get("/api/v1/user/?page=2&limit=4")
        .set("Authorization", `Bearer ${jwt}`);

      expect(statusCode).toBe(200);
      expect(body.status).toBe("success");
      expect(body.message).toBe("User list fetched successfully");
      expect(body.data.userList.length).toBe(3);
      expect(body.data).toEqual({
        userList: expect.arrayContaining([
          {
            _id: expect.any(String),
            email: expect.any(String),
            name: expect.any(String),
            role: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ]),
        count: 7,
      });
    });

    it(`should return 200 and all users data (only name field) when given a valid param (fields = name)`, async () => {
      const { statusCode, body } = await supertest(app)
        .get("/api/v1/user/?fields=name")
        .set("Authorization", `Bearer ${jwt}`);

      expect(statusCode).toBe(200);
      expect(body.status).toBe("success");
      expect(body.message).toBe("User list fetched successfully");
      expect(body.data.userList.length).toBe(7);
      expect(body.data).toEqual({
        userList: expect.arrayContaining([
          {
            _id: expect.any(String),
            name: expect.stringContaining("kuro"),
          },
        ]),
        count: 7,
      });
    });

    it(`should return 200 and 4 users data (only containing kuro) when given a valid param (search = kuro)`, async () => {
      const { statusCode, body } = await supertest(app)
        .get("/api/v1/user/?search=kuro")
        .set("Authorization", `Bearer ${jwt}`);

      expect(statusCode).toBe(200);
      expect(body.status).toBe("success");
      expect(body.message).toBe("User list fetched successfully");
      expect(body.data.userList.length).toBe(4);
      expect(body.data).toEqual({
        userList: expect.arrayContaining([
          {
            _id: expect.any(String),
            email: expect.stringContaining("kuro"),
            name: expect.stringContaining("kuro"),
            role: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ]),
        count: 4,
      });
    });

    it(`should return 200 and 1 user data when given a valid param (name = kuro)`, async () => {
      const { statusCode, body } = await supertest(app)
        .get("/api/v1/user/?name=kuro")
        .set("Authorization", `Bearer ${jwt}`);

      expect(statusCode).toBe(200);
      expect(body.status).toBe("success");
      expect(body.message).toBe("User list fetched successfully");
      expect(body.data.userList.length).toBe(1);
      expect(body.data).toEqual({
        userList: expect.arrayContaining([
          {
            _id: expect.any(String),
            email: "kuro@mail.com",
            name: "kuro",
            role: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ]),
        count: 1,
      });
    });
  });
});
