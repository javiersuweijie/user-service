const express = require("express");
const cookieParser = require("cookie-parser");
const { UserController } = require("./controllers/user");
const { UserFileSystemRepository } = require("./repositories/user-filesystem");
const { AuthenticationService } = require("./services/authentication");
const { AuthenticationMiddleware } = require("./middlewares/authentication");

const JWT_SECRET = process.env.JWT_SECRET;

const CreateApp = async () => {
  app = express();
  app.use(express.json());
  app.use(cookieParser());
  const userRepository = new UserFileSystemRepository(
    process.env.DATABASE_FILE
  );
  await userRepository.connect();
  const authenticationService = new AuthenticationService(
    JWT_SECRET,
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
  return app;
};

module.exports = {
  CreateApp,
};
