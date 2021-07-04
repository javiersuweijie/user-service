const express = require("express");
const { UserController } = require("./controllers/user");
const { UserFileSystemRepository } = require("./repositories/user-filesystem");

const CreateApp = async () => {
  app = express();
  app.use(express.json());
  const userRepository = new UserFileSystemRepository(
    process.env.DATABASE_FILE
  );
  await userRepository.connect();
  UserController(app, userRepository);
  return app;
};

module.exports = {
  CreateApp,
};
