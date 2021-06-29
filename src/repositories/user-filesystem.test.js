const { UserFileSystemRepository } = require("./user-filesystem");
const fs = require("fs");

jest.mock("fs");
describe("UserFileSystemRepository", () => {
  describe("insert", () => {
    describe("given an empty database", () => {
      let userRepository;
      beforeEach(() => {
        fs.readFileSync.mockReturnValue("{}");
        userRepository = new UserFileSystemRepository();
      });
      test("should insert a user", () => {
        const user = userRepository.insert({
          email: "test@user.com",
          name: "tester",
          password_hash: "123123",
        });
        expect(user.id).toBe(0);
      });
      test("should insert two users with ascending id", () => {
        userRepository.insert({
          email: "test@user.com",
          name: "tester",
          password_hash: "123123",
        });
        const user = userRepository.insert({
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
