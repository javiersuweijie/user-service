const UserController = (app, userRepository) => {
  app.get("/users", (request, response) => {
    const users = userRepository.findAll();
    response.json(users);
  });

  app.post("/users", (req, res) => {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
    };
    const user = userRepository.insert(newUser);
    res.json(user);
  });

  app.get("/users/:user_id", (req, res) => {
    const id = req.params.user_id;
    const user = userRepository.find(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.put("/users/:user_id", (req, res) => {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };
    const id = req.params.user_id;
    const user = userRepository.update(id, fieldsToUpdate);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.delete("/users/:user_id", (req, res) => {
    const id = req.params.user_id;
    userRepository.delete(id);
    res.json({});
  });
};

module.exports = {
  UserController,
};
