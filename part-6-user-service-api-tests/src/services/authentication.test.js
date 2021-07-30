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
        const token = await authenticationService.loginAndGenerateJwt({
          email: "test@user.com",
          password: "password123",
        });
        expect(token).toBeTruthy();
        expect(token.split(".").length).toBe(3);
      });
      test("return undefined when password is wrong", async () => {
        const token = await authenticationService.loginAndGenerateJwt({
          email: "test@user.com",
          password: "wrong",
        });
        expect(token).toBeUndefined();
      });
    });
    describe("given a user that is not found", () => {
      beforeAll(() => {
        userRepository.findByEmail.mockResolvedValue(undefined);
      });
      test("return undefined when trying to login", async () => {
        const token = await authenticationService.loginAndGenerateJwt({
          email: "test@user.com",
          password: "wrong",
        });
        expect(token).toBeUndefined();
      });
    });
  });

  describe("validateJwt", () => {
    test("should return id when token is verified", () => {
      const userId = 1;
      const token = jwt.sign({ user_id: userId }, jwtSecret, {
        expiresIn: 60 * 60, // 1 hour
      });
      const actualUserId = authenticationService.validateJwt(token);
      expect(actualUserId).toBe(userId);
    });
    test("should throw error when token is wrong", () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MjQ4OTQyMDQsImV4cCI6MTYyNDg5NzgwNH0.oWpHSzVzwHyORsmzGjchP4-82TaS2s_qjindAW76Lqg";
      expect(() => {
        authenticationService.validateJwt(token);
      }).toThrow("invalid signature");
    });
    test("should throw error when token is expired", () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MjQ4OTM1MTIsImV4cCI6MTYyNDg5NzExMn0.pR4zqg-k3IgfzP0VSdKNWsxEfVX9urLf3K8XcF2eWNQ";
      expect(() => {
        authenticationService.validateJwt(token);
      }).toThrow("jwt expired");
    });
  });
});
