const { User } = require("../entities/user");
const fs = require("fs");

/**
 * UserFileSystemRepository
 * A natve implementation of a database that saves directly to a file
 * Do not use this in production
 */
class UserFileSystemRepository {
  static repositoryInstance;
  /**
   * Creates an instance of the repository.
   * Multiple calls to this construct returns the same instance
   * @param {*} file
   */
  constructor(file) {
    if (UserFileSystemRepository.repositoryInstance) {
      return UserFileSystemRepository.repositoryInstance;
    }
    if (!file) {
      throw new Error("Database requires a file input");
    }
    this.file = file;
    UserFileSystemRepository.repositoryInstance = this;
  }

  /**
   * Connect to the database
   * @returns Promise<?> Promise that completes when connection is ready
   */
  async connect() {
    if (fs.existsSync(this.file)) {
      await this._read();
    } else {
      this.database = {};
      this.counter = 0;
      this._write();
    }
    return;
  }

  /**
   * Takes in a User object and saved into the database
   * @param {User} user
   * @returns {User} User that was created
   */
  async insert(user) {
    if (!user instanceof User) {
      throw new Error("Input needs to be a User object");
    }
    const userToSave = {
      ...user,
      id: this.counter,
    };
    this.database[this.counter] = userToSave;
    await this._write();
    this.counter++;
    return userToSave;
  }

  /**
   * Takes in a user id and returns a User object
   * @param {number} id
   * @returns {User|undefined} User in the database
   */
  async find(id) {
    await this._read();
    const userObject = this.database[id];
    if (userObject) {
      return new User(userObject);
    }
    return;
  }

  /**
   * Returns all Users in the database
   * @returns {User[]}
   */
  async findAll() {
    await this._read();
    const users = Object.values(this.database);
    return users.map((user) => new User(user));
  }

  /**
   * Find User by email. Returns the first user that matches the email
   * @param {string} email
   * @returns {User|undefined}
   */
  async findByEmail(email) {
    await this._read();
    const user = Object.values(this.database).find(
      (user) => user.email === email
    );
    if (user) {
      return new User(user);
    }
    return;
  }

  /**
   * Deletes a single user in the database
   * @param {number} id
   */
  async delete(id) {
    delete this.database[id];
    await this._write();
    return;
  }

  /**
   * Updates a User
   * @param {number} id
   * @param {User} user
   * @returns
   */
  async update(id, user) {
    if (!user instanceof User) {
      throw new Error("Input needs to be a User object");
    }
    await this._read();
    const userToUpdate = this.database[id];
    if (userToUpdate) {
      const keys = Object.keys(user);
      for (const key of keys) {
        if (user[key]) {
          userToUpdate[key] = user[key];
        }
      }
      await this._write();
    }
    return userToUpdate;
  }

  /**
   * Private function to write to the database
   * Not meant to be called externally
   * @returns Promise<?>
   */
  async _write() {
    const databaseString = JSON.stringify(this.database, null, 2);
    return fs.promises.writeFile(this.file, databaseString);
  }

  /**
   * Private function to read from the database
   * Not meant to be called externally
   * @returns Promise<?>
   */
  async _read() {
    const databaseContent = await fs.promises.readFile(this.file, {
      encoding: "utf-8",
    });
    this.database = JSON.parse(databaseContent);
    const keys = Object.keys(this.database).map((k) => Number(k));
    this.counter = keys.length === 1 ? 0 : Math.max(keys);
    return;
  }

  /**
   * Delete all users in the database
   */
  async deleteAll() {
    this.database = {};
    this.counter = 0;
    return this._write();
  }
}

module.exports = {
  UserFileSystemRepository,
};
