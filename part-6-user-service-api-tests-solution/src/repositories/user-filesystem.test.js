const { UserFileSystemRepository } = require("./user-filesystem");
const fs = require("fs");
const { User } = require("../entities/user");

jest.mock("fs");
describe("UserFileSystemRepository", () => {
  let userRepository;
  beforeEach(async () => {
    fs.promises = {
      writeFile: jest.fn().mockResolvedValue(true),
      readFile: jest.fn().mockResolvedValue("{}"),
    };
    fs.existsSync = jest.fn().mockReturnValue(true);
    userRepository = new UserFileSystemRepository("noop");
    await userRepository.connect();
  });
  describe("insert", () => {
    describe("given an empty database", () => {
      beforeEach(() => {
        fs.promises.readFile = jest.fn().mockResolvedValue("{}");
      });
      test("should insert a user", async () => {
        const user = await userRepository.insert({
          email: "test@user.com",
          name: "tester",
          password_hash: "123123",
        });
        expect(user.id).toBe(0);
        expect(fs.promises.writeFile.mock.calls[0][1]).toMatch(
          JSON.stringify(
            {
              0: {
                ...user,
                id: 0,
              },
            },
            null,
            2
          )
        );
      });
      test("should insert two users with ascending id", async () => {
        const user0 = await userRepository.insert({
          email: "test@user.com",
          name: "tester",
          password_hash: "123123",
        });
        const user1 = await userRepository.insert({
          email: "test2@user.com",
          name: "tester2",
          password_hash: "123123",
        });
        expect(user1.id).toBe(1);
        expect(fs.promises.writeFile.mock.calls[1][1]).toMatch(
          JSON.stringify(
            {
              0: {
                ...user0,
                id: 0,
              },
              1: {
                ...user1,
                id: 1,
              },
            },
            null,
            2
          )
        );
      });
    });
  });
  describe("find", () => {
    describe("given a database with a few users", () => {
      beforeEach(() => {
        fs.promises.readFile = jest.fn().mockResolvedValue(`
        {
            "0": {"id": 0, "name": "tester 0", "email": "tester0@x.com"},
            "2": {"id": 2, "name": "tester 2", "email": "tester2@x.com"}
        }
        `);
      });
      test("should find user with id = 1", async () => {
        const user = await userRepository.find(2);
        expect(user.id).toBe(2);
      });
      test("should return undefined with id = 3", async () => {
        const user = await userRepository.find(3);
        expect(user).toBeUndefined();
      });
    });
  });
  describe("findByEmail", () => {
    describe("given a database with a few users", () => {
      beforeEach(() => {
        fs.promises.readFile = jest.fn().mockResolvedValue(`
            {
                "0": {"id": 0, "name": "tester 0", "email": "tester0@x.com"},
                "2": {"id": 2, "name": "tester 2", "email": "tester2@x.com"}
            }
            `);
      });
      test("should find user with email", async () => {
        const user = await userRepository.findByEmail("tester0@x.com");
        expect(user.id).toBe(0);
      });
      test("should return undefined with unknown email", async () => {
        const user = await userRepository.findByEmail("tester3@x.com");
        expect(user).toBeUndefined();
      });
    });
  });
  describe("findAll", () => {
    describe("given a database with no users", () => {
      beforeEach(() => {
        fs.promises.readFile = jest.fn().mockResolvedValue(`
        {}
        `);
      });
      test("should return empty array", async () => {
        const users = await userRepository.findAll();
        expect(users.length).toBe(0);
      });
    });
    describe("given a database with a few users", () => {
      beforeEach(() => {
        fs.promises.readFile = jest.fn().mockResolvedValue(`
        {
            "0": {"id": 0, "name": "tester 0", "email": "tester0@x.com"},
            "2": {"id": 2, "name": "tester 2", "email": "tester2@x.com"}
        }
        `);
      });
      test("should return all users", async () => {
        const users = await userRepository.findAll();
        expect(users.length).toBe(2);
      });
    });
  });
  describe("update", () => {
    describe("given a database with a few users", () => {
      beforeEach(() => {
        fs.promises.readFile = jest.fn().mockResolvedValue(`
        {
            "0": {"id": 0, "name": "tester 0", "email": "tester0@x.com"},
            "2": {"id": 2, "name": "tester 2", "email": "tester2@x.com"}
        }
        `);
      });
      test("should update a user", async () => {
        const user = new User({
          name: "updated name",
          email: "updated@email.com",
        });
        const updatedUser = await userRepository.update(0, user);
        expect(updatedUser.email).toBe(user.email);
        expect(updatedUser.name).toBe(user.name);
        expect(updatedUser.id).toBe(0);
      });
      test("should return undefined for an unknown user", async () => {
        const user = new User({
          name: "updated name",
          email: "updated@email.com",
        });
        const updatedUser = await userRepository.update(4, user);
        expect(updatedUser).toBeUndefined();
      });
    });
  });
  describe("delete", () => {
    describe("given a database with a few users", () => {
      beforeEach(() => {
        fs.promises.readFile = jest.fn().mockResolvedValue(`
        {
            "0": {"id": 0, "name": "tester 0", "email": "tester0@x.com"},
            "2": {"id": 2, "name": "tester 2", "email": "tester2@x.com"}
        }
        `);
      });
      test("should delete a user", async () => {
        await userRepository.delete(0);
        expect(fs.promises.writeFile.mock.calls[0][1]).toMatch(
          JSON.stringify(
            {
              2: { id: 2, name: "tester 2", email: "tester2@x.com" },
            },
            null,
            2
          )
        );
      });
    });
  });
  describe("deleteAll", () => {
    describe("given a database with a few users", () => {
      beforeEach(() => {
        fs.promises.readFile = jest.fn().mockResolvedValue(`
        {
            "0": {"id": 0, "name": "tester 0", "email": "tester0@x.com"},
            "2": {"id": 2, "name": "tester 2", "email": "tester2@x.com"}
        }
        `);
      });
      test("should delete a user", async () => {
        await userRepository.deleteAll();
        expect(fs.promises.writeFile.mock.calls[0][1]).toMatch(
          JSON.stringify({}, null, 2)
        );
      });
    });
  });
});
