const express = require("express");
const { UserController } = require("./controllers/user");
const { UserFileSystemRepository } = require("./repositories/user-filesystem");

const CreateApp = () => {
  app = express();
  app.use(express.json());
  const userRepository = new UserFileSystemRepository();
  UserController(app, userRepository);
  return app;
};

module.exports = {
  CreateApp,
};
