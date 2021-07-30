const { hashPassword } = require("./password-utils");
const jwt = require("jsonwebtoken");

class AuthenticationService {
  constructor(secret, userRepository) {
    this.secret = secret;
    this.userRepository = userRepository;
  }

  /**
   * Takes in an email and password to return a json web token (JWT)
   * @param {*} loginDetails
   * loginDetails takes a schema
   * { email: string, password: string}
   *
   * 1. Get the user by email using the user repository
   * 2. Use _checkPassword to compare the password hashes
   * 3. Use _generateJwt to generate a jwt with user_id as a payload
   *
   * @returns {string} JWT string
   */
  async loginAndGenerateJwt(loginDetails) {}

  /**
   * Given a JWT, validate that it is signed by us and return the user_id
   * @param {string} token
   * @returns {string} user_id
   */
  validateJwt(token) {}

  /**
   * Compares the password sent to the passwordHash
   * See the password utils for password hashing implementation
   * @param {string} passwordHash
   * @param {string} passwordSent
   *
   * @returns {boolean} Returns true is password matches
   */
  _checkPassword(passwordHash, passwordSent) {}

  /**
   * Generate a JWT using the secret and with user_id as a payload
   * @param {string} userId
   *
   * @returns {string} JWT string
   */
  _generateJwt(userId) {}
}

module.exports = {
  AuthenticationService,
};
