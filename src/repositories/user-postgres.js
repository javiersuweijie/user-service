const { User } = require("../entities/user");
const { Pool } = require("pg");

/**
 * UserFileSystemRepository
 * A natve implementation of a database that saves directly to a file
 * Do not use this in production
 */
class UserPostgresRepository {
  static repositoryInstance;
  /**
   * Creates an instance of the repository.
   * Multiple calls to this construct returns the same instance
   * @param {*} file
   */
  constructor(dataBaseUrl) {
    if (UserPostgresRepository.repositoryInstance) {
      return UserPostgresRepository.repositoryInstance;
    }
    this.pool = new Pool({
      connectionString: dataBaseUrl,
    });
    UserPostgresRepository.repositoryInstance = this;
  }

  /**
   * Connect to the database
   * @returns Promise<?> Promise that completes when connection is ready
   */
  async connect() {
    return this.pool.connect();
  }

  /**
   * Takes in a User object and saved into the database
   * @param {User} user
   * @returns {User} User that was created
   */
  async insert(user) {
    const results = await this.pool.query(
      `
          INSERT INTO users(name, email, password_hash) VALUES
          ($1, $2, $3) RETURNING *;
          `,
      [user.name, user.email, user.password_hash]
    );
    const insertedUser = results.rowCount
      ? new User(results.rows[0])
      : undefined;
    return insertedUser;
  }

  /**
   * Takes in a user id and returns a User object
   * @param {number} id
   * @returns {User|undefined} User in the database
   */
  async find(id) {
    const results = await this.pool.query(
      `
        SELECT *
        FROM users
        WHERE id = $1
      `,
      [id]
    );
    const user = results.rowCount ? new User(results.rows[0]) : undefined;
    return user;
  }

  /**
   * Returns all Users in the database
   * @returns {User[]}
   */
  async findAll() {
    const results = await this.pool.query(`
        SELECT *
        FROM users; 
      `);
    const users = results.rows.map((row) => new User(row));
    return users;
  }

  /**
   * Find User by email. Returns the first user that matches the email
   * @param {string} email
   * @returns {User|undefined}
   */
  async findByEmail(email) {
    const results = await this.pool.query(
      `
        SELECT *
        FROM users
        WHERE email = $1
      `,
      [email]
    );
    const user = results.rowCount ? new User(results.rows[0]) : undefined;
    return user;
  }

  /**
   * Deletes a single user in the database
   * @param {number} id
   */
  async delete(id) {
    const results = await this.pool.query(
      `
        DELETE FROM users
        WHERE id = $1
      `,
      [id]
    );
    const isDeleted = results.rowCount > 0;
    return isDeleted;
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
    const keys = Object.keys(user);
    const fieldsToUpdate = keys.filter((k) => user[k]);
    const argsToUpdate = [id].concat(fieldsToUpdate.map((k) => user[k]));
    const argsFields = fieldsToUpdate.map((k, i) => `${k} = $${i + 2}`);
    const query = `
    UPDATE users SET ${argsFields}
    WHERE id = $1 RETURNING *;`;
    const results = await this.pool.query(query, argsToUpdate);
    return results.rowCount ? new User(results.rows[0]) : undefined;
  }

  /**
   * Delete all users in the database
   */
  async deleteAll() {
    const results = await this.pool.query(
      `
          DELETE FROM users;
          `
    );
    const isDeleted = results.rowCount > 0;
    return isDeleted;
  }
}

module.exports = {
  UserPostgresRepository,
};
