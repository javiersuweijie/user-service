const { UserFileSystemRepository } = require("./user-filesystem");
const fs = require("fs");

jest.mock("fs");
describe("UserFileSystemRepository", () => {
  describe("insert", () => {
    describe("given an empty database", () => {
      let userRepository;
      beforeEach(() => {
        fs.promises = {
          writeFile: jest.fn().mockResolvedValue(true),
          readFile: jest.fn().mockResolvedValue("{}"),
        };
        fs.existsSync = jest.fn().mockReturnValue(true);
        userRepository = new UserFileSystemRepository("noop");
        userRepository.connect();
      });
      test("should insert a user", async () => {
        const user = await userRepository.insert({
          email: "test@user.com",
          name: "tester",
          password_hash: "123123",
        });
        expect(user.id).toBe(0);
      });
      test("should insert two users with ascending id", async () => {
        await userRepository.insert({
          email: "test@user.com",
          name: "tester",
          password_hash: "123123",
        });
        const user = await userRepository.insert({
          email: "test2@user.com",
          name: "tester2",
          password_hash: "123123",
        });
        expect(user.id).toBe(1);
      });
    });
  });
  describe("find", () => {});
  describe("findByEmail", () => {});
  describe("findAll", () => {});
  describe("update", () => {});
});
