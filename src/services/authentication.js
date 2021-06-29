const { hashPassword } = require("../password-utils");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

class AuthenticationService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async loginAndGenerateJwt(loginDetails) {
    const { email, password } = loginDetails;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return;
    }
    if (!this.checkPassword(user.password_hash, password)) {
      return;
    }
    return this.generateJwt(user.id);
  }

  checkPassword(passwordHash, passwordSent) {
    const submittedPasswordHash = hashPassword(passwordSent);
    return passwordHash === submittedPasswordHash;
  }

  generateJwt(userId) {
    const token = jwt.sign({ user_id: userId }, JWT_SECRET, {
      expiresIn: 60 * 60, // 1 hour
    });
    return token;
  }

  validateJwt(token) {
    const verifiedToken = jwt.verify(token, JWT_SECRET);
    const userId = verifiedToken.user_id;
    return userId;
  }
}

module.exports = {
  AuthenticationService,
};
