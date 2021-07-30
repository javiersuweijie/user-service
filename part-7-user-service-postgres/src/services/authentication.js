const { hashPassword } = require("../password-utils");
const jwt = require("jsonwebtoken");

class AuthenticationService {
  constructor(secret, userRepository) {
    this.secret = secret;
    this.userRepository = userRepository;
  }

  async loginAndGenerateJwt(loginDetails) {
    const { email, password } = loginDetails;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return;
    }
    if (!this._checkPassword(user.password_hash, password)) {
      return;
    }
    return this._generateJwt(user.id);
  }

  validateJwt(token) {
    const verifiedToken = jwt.verify(token, this.secret);
    const userId = verifiedToken.user_id;
    return userId;
  }

  _checkPassword(passwordHash, passwordSent) {
    const submittedPasswordHash = hashPassword(passwordSent);
    return passwordHash === submittedPasswordHash;
  }

  _generateJwt(userId) {
    const token = jwt.sign({ user_id: userId }, this.secret, {
      expiresIn: 60 * 60, // 1 hour
    });
    return token;
  }
}

module.exports = {
  AuthenticationService,
};
