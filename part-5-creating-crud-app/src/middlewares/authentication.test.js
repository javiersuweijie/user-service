const { getMockReq, getMockRes } = require("@jest-mock/express");
const { AuthenticationMiddleware } = require("./authentication");
const { AuthenticationService } = require("../services/authentication");
jest.mock("../services/authentication");

describe("AuthenticationMiddleware", () => {
  let authenticationMiddleware, authenticationService;
  beforeAll(() => {
    authenticationService = new AuthenticationService();
    authenticationMiddleware = new AuthenticationMiddleware(
      authenticationService
    );
  });
  describe("middleware", () => {
    describe("given that the request has no token", () => {
      test("should not pass request to next middleware", () => {
        const req = getMockReq();
        const { res, next } = getMockRes();
        authenticationMiddleware.middleware()(req, res, next);
        expect(next).not.toBeCalledWith(null);
        expect(res.status).toBeCalledWith(401);
      });
    });
    describe("given that the request has a token", () => {
      let req;
      beforeEach(() => {
        req = getMockReq({
          cookies: {
            token: "token",
          },
        });
      });
      test("should pass request to next middleware if auth is verified", () => {
        authenticationService.validateJwt.mockReturnValue({
          user_id: 1,
        });
        const { res, next } = getMockRes();
        authenticationMiddleware.middleware()(req, res, next);
        expect(next).toBeCalledWith(null);
        expect(res.status).not.toBeCalledWith(401);
      });
      test("should not pass request to next middleware if auth is not verified", () => {
        authenticationService.validateJwt.mockImplementation(() => {
          throw new Error("validation error");
        });
        const { res, next } = getMockRes();
        authenticationMiddleware.middleware()(req, res, next);
        expect(next).not.toBeCalledWith(null);
        expect(res.status).toBeCalledWith(401);
      });
    });
  });
});
