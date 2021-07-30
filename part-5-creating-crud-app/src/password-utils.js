const crypto = require("crypto");
const PASSWORD_SALT = process.env.PASSWORD_SALT;

const hashPassword = (password) => {
  const md5sum = crypto.createHash("md5");
  const hash = md5sum.update(password + PASSWORD_SALT).digest("hex");
  return hash;
};

module.exports = {
  hashPassword,
};
