const request = require("supertest");
const { CreateApp } = require("../src/app");
require("dotenv").config({
  path: ".env.test",
});
const DATABASE_FILE = process.env.DATABASE_FILE;
const {
  UserFileSystemRepository,
} = require("../src/repositories/user-filesystem");

describe("User API tests", () => {
  let app, userRepository;
  describe("GET /users", () => {
    describe("given an empty database", () => {
      beforeAll(async () => {
        app = await CreateApp();
      });
      test("should return empty []", async () => {
        const res = await request(app).get("/users").expect(200);
        expect(res.body).toEqual([]);
      });
    });
    describe("given some users in the database", () => {
      beforeAll(async () => {
        userRepository = new UserFileSystemRepository(DATABASE_FILE);
        await userRepository.insert({
          email: "test@test.com",
          name: "tester",
          password_hash: "sdfkjlk",
        });
        await userRepository.insert({
          email: "test2@test.com",
          name: "tester 2",
          password_hash: "sdfkjlk",
        });
        app = await CreateApp();
      });
      afterAll(async () => {
        return userRepository.deleteAll();
      });
      test("should return all users", async () => {
        const res = await request(app).get("/users").expect(200);
        const users = res.body;
        expect(users.length).toBe(2);
        expect(users[0]).toMatchObject({
          email: "test@test.com",
          name: "tester",
          password_hash: "sdfkjlk",
        });
      });
    });
  });
  describe("POST /users", () => {});
  describe("GET /users/:id", () => {});
  describe("PUT /users/:id", () => {});
  describe("POST /users/login", () => {});
  describe("GET /users/whoami", () => {});
});
