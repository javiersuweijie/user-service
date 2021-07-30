const express = require("express");
const cookieParser = require("cookie-parser");
const { UserController } = require("./controllers/user");
const { UserFileSystemRepository } = require("./repositories/user-filesystem");
const { AuthenticationService } = require("./services/authentication");
const { AuthenticationMiddleware } = require("./middlewares/authentication");

const CreateApp = async (jwtSecret, databaseUrl) => {
  app = express();
  app.use(express.json());
  app.use(cookieParser());
  const userRepository = new UserFileSystemRepository(databaseUrl);
  await userRepository.connect();
  const authenticationService = new AuthenticationService(
    jwtSecret,
    userRepository
  );
  const authenticationMiddleware = new AuthenticationMiddleware(
    authenticationService
  );
  UserController(
    app,
    userRepository,
    authenticationService,
    authenticationMiddleware
  );
  app.stop = async () => {};
  return app;
};

module.exports = {
  CreateApp,
};
