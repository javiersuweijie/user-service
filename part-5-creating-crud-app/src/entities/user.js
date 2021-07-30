const { hashPassword } = require("../password-utils");

class User {
  constructor(user) {
    this.name = user.name;
    this.email = user.email;
    this.id = user.id;
    if (user.password) {
      this.password_hash = hashPassword(user.password);
    } else {
      this.password_hash = user.password_hash;
    }
  }
}

module.exports = {
  User,
};
