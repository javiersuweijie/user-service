const nodemailer = require("nodemailer");

class EmailRepository {
  constructor(username, password) {
    this.transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: username,
        pass: password,
      },
    });
  }

  async sendEmail(to, subject, text) {
    const result = this.transport.sendMail({
      to: to,
      subject: subject,
      text: text,
    });
    return result;
  }
}

module.exports = {
  EmailRepository,
};
