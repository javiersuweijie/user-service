// TODO: Implement RESTful API in this controller as per your openAPI spec design
const UserController = (app, userRepository) => {
  // The first endpoint has already been done for you.
  // request.body contains the data that was sent in JSON
  // response.json is a function to send the final response in JSON with 200 HTTP Code
  // userRepository (src/repositories/user-filesystem.js)
  // contains all the functions to read and write to a (fake) database
  app.get("/users", (request, response) => {
    const users = userRepository.findAll();
    response.json(users);
  });

  // TODO: Endpoint to create a user

  // TODO: Endpoint to get a single user by id

  // TODO: Endpoint to update the details of a user by id

  // TODO: Endpoint to delete a user by id
};

module.exports = {
  UserController,
};
