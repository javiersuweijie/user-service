const { User } = require("../entities/user");

const UserController = (
  app,
  userRepository,
  authenticationService,
  authenticationMiddleware
) => {
  app.get("/users/whoami", [
    authenticationMiddleware.middleware(),
    async (req, res) => {
      const user = await userRepository.find(req.user_id);
      if (user) {
        res.json(userResponse(user));
      } else {
        res.status(404).json({ error: "User not found" });
      }
    },
  ]);

  app.get("/users", async (req, res) => {
    const users = await userRepository.findAll();
    return res.json(users.map((u) => userResponse(u)));
  });

  app.post("/users", async (req, res) => {
    const validationError = validateEmailAndPassword(req);
    if (validationError) {
      return res.status(400).json(validationError);
    }
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const user = await userRepository.insert(newUser);
    return res.json(userResponse(user));
  });

  app.get("/users/:user_id", async (req, res) => {
    const id = req.params.user_id;
    const user = await userRepository.find(id);
    if (user) {
      res.json(userResponse(user));
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
      res.json(userResponse(user));
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.delete("/users/:user_id", async (req, res) => {
    const id = req.params.user_id;
    await userRepository.delete(id);
    res.json({});
  });

  app.post("/users/login", async (req, res) => {
    const validationError = validateEmailAndPassword(req);
    if (validationError) {
      return res.status(400).json(validationError);
    }
    const loginDetails = {
      email: req.body.email,
      password: req.body.password,
    };
    const token = await authenticationService.loginAndGenerateJwt(loginDetails);
    if (!token) {
      return res.status(401).json({ error: "Login failed" });
    }
    return res
      .cookie("token", token, {
        httpOnly: true,
      })
      .json({ success: true });
  });
};

// TODO: Handle file upload and save it in a local folder
app.post("/users/:display_picture");

function validateEmailAndPassword(req) {
  if (!req.body.email) {
    return { error: "Email is required" };
  }
  if (!req.body.password) {
    return { error: "Password is required" };
  }
  return;
}

function userResponse(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

module.exports = {
  UserController,
};
