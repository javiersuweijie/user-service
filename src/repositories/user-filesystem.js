const { User } = require("../entities/user");
const fs = require("fs");

// Do not use this in production
class UserFileSystemRepository {
  constructor(file) {
    this.file = file || "./users.json";
    if (fs.existsSync(this.file)) {
      const databaseContent = fs.readFileSync(this.file, { encoding: "utf-8" });
      this.database = JSON.parse(databaseContent);
      this.counter = Object.keys(this.database).length;
    } else {
      this.database = {};
      this.counter = 0;
      this._write();
    }
  }

  async insert(userToInsert) {
    const user = new User({
      ...userToInsert,
      id: this.counter,
    });
    this.database[user.id] = user;
    await this._write();
    this.counter++;
    return user;
  }

  async find(id) {
    return this.database[id];
  }

  async findAll() {
    const users = Object.values(this.database);
    return users.map((user) => new User(user));
  }

  async delete(id) {
    delete this.database[id];
    await this._write();
    return;
  }

  async update(id, user) {
    const userToUpdate = this.database[id];
    if (userToUpdate) {
      Object.assign(userToUpdate, user);
    }
    return userToUpdate;
  }

  async _write() {
    const databaseString = JSON.stringify(this.database, null, 2);
    return fs.promises.writeFile(this.file, databaseString);
  }
}

module.exports = {
  UserFileSystemRepository,
};
