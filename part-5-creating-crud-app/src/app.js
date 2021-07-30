const express = require("express");
const cookieParser = require("cookie-parser");
const { UserController } = require("./controllers/user");
const { UserFileSystemRepository } = require("./repositories/user-filesystem");

const CreateApp = async (jwtSecret, databaseUrl) => {
  app = express();
  app.use(express.json());
  app.use(cookieParser());
  const userRepository = new UserFileSystemRepository(databaseUrl);
  await userRepository.connect();
  UserController(app, userRepository);
  return app;
};

module.exports = {
  CreateApp,
};
