require("dotenv").config();
module.exports = class Email {
  constructor(email, token) {
    //properties
    this.NODE_MAILER = require("nodemailer");
    this.USER_MAIL = email;
    this.USER_TOKEN = token;
  }

  async sendForgetPasswordEmailToUser() {
    try {
      const transporter = this.#createTransport();
      const Mailoptions = this.#mailOptionBuilder();
      return await transporter.sendMail(Mailoptions);
    } catch (err) {
      console.log(
        "err in sendForgetPasswordEmailToUser method email service class",
        err)
        return null

    
    }
  }

  /*helper method*/

  #createTransport() {
    return this.NODE_MAILER.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.USER_EMAIL_PASSWORD,
      },
    });
  }

  //
  #mailOptionBuilder() {
    return {
      from: process.env.USER_MAIL, // Sender address
      to: this.USER_MAIL, // List of recipients
      subject: "CheckPrix reset password link", // Subject line
      text: "Hello from checkPrix", // Plain text body
      html: this.#mailTemplateBuilder(), // HTML body
    };
  }

  #mailTemplateBuilder() {
    const host =
      process.env.DEVELOPMENT === "true"
        ? process.env.LOCAL_ENV
        : process.env.PRO.ENV;
    return `<a href=${host}/reset-password/${this.USER_TOKEN}>Click here for rest password</a>`;
  }
};
