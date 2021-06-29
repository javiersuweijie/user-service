const UserController = (app, userRepository) => {
  app.get("/users", async (request, response) => {
    const users = await userRepository.findAll();
    response.json(users);
  });

  app.post("/users", async (req, res) => {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
    };
    const user = await userRepository.insert(newUser);
    res.json(user);
  });

  app.get("/users/:user_id", async (req, res) => {
    const id = req.params.user_id;
    const user = await userRepository.find(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.put("/users/:user_id", async (req, res) => {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };
    const id = req.params.user_id;
    const user = await userRepository.update(id, fieldsToUpdate);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.delete("/users/:user_id", async (req, res) => {
    const id = req.params.user_id;
    await userRepository.delete(id);
    res.json({});
  });
};

module.exports = {
  UserController,
};
