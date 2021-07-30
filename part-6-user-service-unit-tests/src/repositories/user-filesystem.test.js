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
        // We are checking the calls to the write function here
        // Since we don't actually call the writeFile function
        // we are able to use mocks to spy on the arguments
        // that was used.
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
    /**
     * Sample code for how to seed the database with information before calling it
     */
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
        // TODO
      });
    });
  });
  /**
   * Fill in the following with the test cases
   */
  describe("findByEmail", () => {
    // TODO
  });
  describe("findAll", () => {
    // TODO
  });
  describe("update", () => {
    // TODO
  });
  describe("delete", () => {
    // TODO
  });
  describe("deleteAll", () => {
    // TODO
  });
});
