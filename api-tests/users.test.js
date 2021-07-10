require("dotenv").config({
  path: ".env.test",
});
const request = require("supertest");
const { CreateApp } = require("../src/app");
const { User } = require("../src/entities/user");
const fs = require("fs");
const DATABASE_FILE = process.env.DATABASE_FILE;
const {
  UserFileSystemRepository,
} = require("../src/repositories/user-filesystem");

describe("User API tests", () => {
  let app, userRepository;
  beforeAll(async () => {
    fs.rmSync(DATABASE_FILE);
    userRepository = new UserFileSystemRepository(DATABASE_FILE);
    app = await CreateApp();
    return app;
  });
  describe("GET /users", () => {
    describe("given an empty database", () => {
      test("should return empty []", async () => {
        const res = await request(app).get("/users").expect(200);
        expect(res.body).toEqual([]);
      });
    });
    describe("given some users in the database", () => {
      beforeAll(async () => {
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
        return app;
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
  describe("POST /users", () => {
    describe("given an empty database", () => {
      afterAll(async () => {
        return userRepository.deleteAll();
      });
      test("should create a new user with id 0", async () => {
        const res = await request(app)
          .post("/users")
          .send({
            name: "tester",
            password: "password",
            email: "tester@email.com",
          })
          .expect(200);
        expect(res.body).toEqual({
          id: 0,
          name: "tester",
          email: "tester@email.com",
          password_hash: "482c811da5d5b4bc6d497ffa98491e38",
        });
      });
      test("should create another new user with id 1", async () => {
        const res = await request(app)
          .post("/users")
          .send({
            name: "tester",
            email: "tester2@email.com",
            password: "password",
          })
          .expect(200);
        expect(res.body).toEqual({
          id: 1,
          name: "tester",
          email: "tester2@email.com",
          password_hash: "482c811da5d5b4bc6d497ffa98491e38",
        });
      });
      test("should return 400 if email not given", async () => {
        const res = await request(app)
          .post("/users")
          .send({
            name: "tester",
            password: "password",
          })
          .expect(400);
      });
    });
  });
  describe("GET /users/:id", () => {
    describe("given a user in the database", () => {
      beforeAll(async () => {
        return userRepository.insert(
          new User({
            name: "tester",
            email: "tester@email.com",
            password: "password",
          })
        );
      });
      afterAll(async () => {
        return await userRepository.deleteAll();
      });
      test("should return a user", async () => {
        const res = await request(app).get("/users/0").expect(200);
        expect(res.body).toEqual({
          id: 0,
          name: "tester",
          email: "tester@email.com",
          password_hash: "482c811da5d5b4bc6d497ffa98491e38",
        });
      });
      test("should return 404 for an unknown user", async () => {
        await request(app).get("/users/2").expect(404);
      });
    });
  });
  describe("PUT /users/:id", () => {
    describe("given a user in the database", () => {
      beforeAll(async () => {
        return userRepository.insert(
          new User({
            name: "tester",
            email: "tester@email.com",
            password: "password",
          })
        );
      });
      afterAll(async () => {
        return await userRepository.deleteAll();
      });
      test("should return a user", async () => {
        const res = await request(app)
          .put("/users/0")
          .send({
            name: "new name",
          })
          .expect(200);
        expect(res.body).toEqual({
          id: 0,
          name: "new name",
          email: "tester@email.com",
          password_hash: "482c811da5d5b4bc6d497ffa98491e38",
        });
      });
      test("should return 404 for an unknown user", async () => {
        await request(app).put("/users/1").expect(404);
      });
    });
  });
  describe("POST /users/login", () => {
    describe("given a user in the database", () => {
      beforeAll(async () => {
        return userRepository.insert(
          new User({
            name: "tester",
            email: "tester@email.com",
            password: "password",
          })
        );
      });
      afterAll(async () => {
        return await userRepository.deleteAll();
      });
      test("should allow user to login with correct password", async () => {
        const res = await request(app)
          .post("/users/login")
          .send({
            email: "tester@email.com",
            password: "password",
          })
          .expect(200);
        const cookieHeader = res.headers["set-cookie"];
        expect(cookieHeader.length).toBeGreaterThanOrEqual(1);
        expect(cookieHeader[0]).toMatch("token");
      });
      test("should return 401 for a wrong password", async () => {
        await request(app)
          .post("/users/login")
          .send({
            email: "tester@email.com",
            password: "2312",
          })
          .expect(401);
      });
      test("should return 401 for an unknown user", async () => {
        await request(app)
          .post("/users/login")
          .send({
            email: "tester2@email.com",
            password: "2312",
          })
          .expect(401);
      });
      test("should return 400 if password not provided", async () => {
        await request(app)
          .post("/users/login")
          .send({
            email: "tester2@email.com",
          })
          .expect(400);
      });
    });
  });
  describe("GET /users/whoami", () => {
    describe("given a user in the database", () => {
      beforeAll(async () => {
        return userRepository.insert(
          new User({
            name: "tester",
            email: "tester@email.com",
            password: "password",
          })
        );
      });
      afterAll(async () => {
        return await userRepository.deleteAll();
      });
      test("calling with jwt token in cookies will return the current user", async () => {
        const res = await request(app)
          .get("/users/whoami")
          .set("Cookie", [
            "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjowLCJpYXQiOjE2MjU4OTIxNjIsImV4cCI6MTYyNTg5NTc2Mn0.DdOEFw6X6CvOLmYNKKo3QK1KVFmGkHTUuzqBpkpiN6g; Path=/; HttpOnly",
          ])
          .expect(200);
        expect(res.body).toEqual({
          name: "tester",
          id: 0,
          email: "tester@email.com",
          password_hash: "482c811da5d5b4bc6d497ffa98491e38",
        });
      });
    });
  });
  describe("DELETE /users/:id", () => {
    describe("given a user in the database", () => {
      beforeAll(async () => {
        return userRepository.insert(
          new User({
            name: "tester",
            email: "tester@email.com",
            password: "password",
          })
        );
      });
      afterAll(async () => {
        return await userRepository.deleteAll();
      });
      test("calling with jwt token in cookies will return the current user", async () => {
        const res = await request(app).delete("/users/0").expect(200);
        expect(res.body).toEqual({});
      });
    });
  });
});
