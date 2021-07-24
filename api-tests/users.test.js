require("dotenv").config({
  path: ".env.test",
});
const request = require("supertest");
const { CreateApp } = require("../src/app");
const { User } = require("../src/entities/user");
const jwt = require("jsonwebtoken");
const {
  connectToDb,
  startMigration,
  truncateTables,
  createDatabase,
  dropDatabase,
} = require("../db-scripts/index");
const { UserPostgresRepository } = require("../src/repositories/user-postgres");
const { DockerComposeEnvironment } = require("testcontainers");
const path = require("path");

jest.setTimeout(30000);

async function createAndMigrateDatabase(databaseUrl, databaseName) {
  await createDatabase(databaseUrl, databaseName);
  const client = await connectToDb(databaseUrl + "/" + databaseName);
  await startMigration(client);
  return client.end();
}

describe("User API tests", () => {
  let app, userRepository, databaseName, compose;
  beforeAll(async () => {
    compose = await new DockerComposeEnvironment(
      path.resolve(__dirname),
      "docker-compose.test.yml"
    ).up();
    databaseName = `database_${Math.floor(Math.random() * 100)}`;
    databaseUrl = process.env.DATABASE_URL;
    await createAndMigrateDatabase(databaseUrl, databaseName);
    userRepository = new UserPostgresRepository(
      databaseUrl + "/" + databaseName
    );
    await userRepository.connect();
    app = await CreateApp(
      process.env.JWT_SECRET,
      databaseUrl + "/" + databaseName
    );
    return app;
  });
  afterAll(async () => {
    await userRepository.disconnect();
    await app.stop();
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
        const res = await request(app).get("/users").expect(200);
        const users = res.body;
        expect(users.length).toBe(2);
        expect(users[0]).toMatchObject({
          email: "test@test.com",
          name: "tester",
        });
      });
    });
  });
  describe("POST /users", () => {
    describe("given an empty database", () => {
      afterAll(async () => {
        return userRepository.deleteAll();
      });
      test("should create a new user", async () => {
        const res = await request(app)
          .post("/users")
          .send({
            name: "tester",
            password: "password",
            email: "tester@email.com",
          })
          .expect(200);
        expect(res.body).toMatchObject({
          name: "tester",
          email: "tester@email.com",
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
      test("should return a user", async () => {
        const res = await request(app)
          .get("/users/" + user.id)
          .expect(200);
        expect(res.body).toMatchObject({
          name: "tester",
          email: "tester@email.com",
        });
      });
      test("should return 404 for an unknown user", async () => {
        await request(app).get("/users/12345678").expect(404);
      });
    });
  });
  describe("PUT /users/:id", () => {
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
      test("should return a user", async () => {
        const res = await request(app)
          .put("/users/" + user.id)
          .send({
            name: "new name",
          })
          .expect(200);
        expect(res.body).toMatchObject({
          name: "new name",
          email: "tester@email.com",
        });
      });
      test("should return 404 for an unknown user", async () => {
        await request(app)
          .put("/users/999999")
          .send({
            name: "new name",
          })
          .expect(404);
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
        expect(res.body).toMatchObject({
          name: "tester",
          email: "tester@email.com",
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
