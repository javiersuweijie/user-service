require("dotenv").config({
  path: ".env",
});
const request = require("supertest");
const { CreateApp } = require("../src/app");
const { User } = require("../src/entities/user");
const jwt = require("jsonwebtoken");
const {
  UserFileSystemRepository,
} = require("../src/repositories/user-filesystem");

jest.setTimeout(30000);
describe("User API tests", () => {
  let app, userRepository, databaseName, compose;
  beforeAll(async () => {
    userRepository = new UserFileSystemRepository("user.json");
    await userRepository.connect();
    app = await CreateApp(process.env.JWT_SECRET, "user.json");
    return app;
  });
  afterAll(async () => {
    await app.stop();
  });
  describe("GET /users", () => {
    describe("given an empty database", () => {
      test("should return empty []", async () => {
        // TODO
      });
    });
    describe("given some users in the database", () => {
      beforeAll(async () => {
        await userRepository.insert(
          new User({
            email: "test@test.com",
            name: "tester",
            password_hash: "sdfkjlk",
          })
        );
        return userRepository.insert(
          new User({
            email: "test2@test.com",
            name: "tester 2",
            password_hash: "sdfkjlk",
          })
        );
      });
      afterAll(async () => {
        return userRepository.deleteAll();
      });
      test("should return all users", async () => {
        // TODO
      });
    });
  });
  describe("POST /users", () => {
    describe("given an empty database", () => {
      afterAll(async () => {
        return userRepository.deleteAll();
      });
      test("should create a new user", async () => {
        // TODO
      });
      test("should return 400 if email not given in the request body", async () => {
        // TODO
      });
    });
  });
  describe("GET /users/:id", () => {
    describe("given a user in the database", () => {
      let user;
      beforeAll(async () => {
        // TODO
      });
      afterAll(async () => {
        return await userRepository.deleteAll();
      });
      // TODO
    });
  });
  describe("PUT /users/:id", () => {
    // TODO
  });
  describe("POST /users/login", () => {
    // TODO
  });
  describe("GET /users/whoami", () => {
    describe("given a user in the database", () => {
      let user;
      beforeAll(async () => {
        user = await userRepository.insert(
          new User({
            name: "tester",
            email: "tester@email.com",
            password: "password",
          })
        );
        return user;
      });
      afterAll(async () => {
        return await userRepository.deleteAll();
      });
      test("calling with jwt token in cookies will return the current user", async () => {
        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60, // 1 hour
        });
        const res = await request(app)
          .get("/users/whoami")
          .set("Cookie", [`token=${token}`])
          .expect(200);
        // TODO
      });
    });
  });
  describe("DELETE /users/:id", () => {
    // TODO
  });
});
