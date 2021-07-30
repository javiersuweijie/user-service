const express = require("express");
const cookieParser = require("cookie-parser");
const { UserController } = require("./controllers/user");
const { UserPostgresRepository } = require("./repositories/user-postgres");
const { AuthenticationService } = require("./services/authentication");
const { AuthenticationMiddleware } = require("./middlewares/authentication");

const CreateApp = async (jwtSecret, databaseUrl) => {
  app = express();
  app.use(express.json());
  app.use(cookieParser());
  const userRepository = new UserPostgresRepository(databaseUrl);
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
  app.stop = async () => {
    return userRepository.disconnect();
  };
  return app;
};

module.exports = {
  CreateApp,
};
