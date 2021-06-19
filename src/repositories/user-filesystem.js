const { User } = require("../entities/user");
const fs = require("fs");

class UserFileSystemRepository {
  constructor(file) {
    this.file = file || "./users.json";
    if (fs.existsSync(this.file)) {
      const databaseContent = fs.readFileSync(this.file, { encoding: "utf-8" });
      this.database = JSON.stringify(databaseContent);
      this.counter = Object.keys(this.database).length;
    } else {
      this.database = {};
      this.counter = 0;
      this._write();
    }
  }

  insert(userToInsert) {
    const user = new User({
      ...userToInsert,
      id: this.counter,
    });
    this.database[user.id] = user;
    this._write();
    this.counter++;
    return user;
  }

  find(id) {
    return this.database[id];
  }

  findAll() {
    const users = Object.values(this.database);
    return users.map((user) => new User(user));
  }

  _write() {
    const databaseString = JSON.stringify(this.database, null, 2);
    fs.writeFileSync(this.file, databaseString);
  }
}

module.exports = {
  UserFileSystemRepository,
};
