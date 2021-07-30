const { hashPassword } = require("./password-utils");
const { UserFileSystemRepository } = require("../repositories/user-filesystem");
const { AuthenticationService } = require("./authentication");
const jwt = require("jsonwebtoken");

jest.mock("../repositories/user-filesystem");

const jwtSecret = "secret";
describe("AuthenticationService", () => {
  let authenticationService, userRepository;
  beforeAll(() => {
    userRepository = new UserFileSystemRepository();
    authenticationService = new AuthenticationService(
      jwtSecret,
      userRepository
    );
  });

  /**
   * Fill in the missing tests
   */
  describe("loginAndGenerateJwt", () => {
    describe("given a user that is found", () => {
      beforeAll(() => {
        userRepository.findByEmail.mockResolvedValue({
          email: "test@user.com",
          name: "test",
          password_hash: hashPassword("password123"),
          id: 1,
        });
      });
      test("return token when password is correct", async () => {
        // TODO
      });
      test("return undefined when password is wrong", async () => {
        // TODO
      });
    });
    describe("given a user that is not found", () => {
      // TODO
    });
  });

  /**
   * You can use the jwt library to generate different tokens to test
   */
  describe("validateJwt", () => {
    test("should return id when token is verified", () => {
      // TODO
    });
    test("should throw error when token is wrong", () => {
      // TODO
    });
    test("should throw error when token is expired", () => {
      // TODO
    });
  });
});
