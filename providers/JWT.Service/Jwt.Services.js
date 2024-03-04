require("dotenv").config();

module.exports = class JWTTOKEN {
  //id of user
  constructor(email) {
    this.USER_MODEL = require("../../models/users");
    this.JWT = require("jsonwebtoken");
    this.FORGET_SECRET_KEY = process.env.FORGET_SECRET_KEY;
    //10 mintues for expiry token
    this.EXPIRY_TOKEN_TIME = 60 * 60 * 24;
    this.Email = email;
  }

  async GenerateTokenForRestPassword() {
    const id = await this.#checkUserExist(this.Email);
    if (id.length === 0) return null;
    const user_id = id;

    const token = this.JWT.sign(
      { id: user_id, time: Date.now() },
      this.FORGET_SECRET_KEY,
      { expiresIn: this.EXPIRY_TOKEN_TIME }
    );

    return token;
  }

  static verifyResetPasswordToken(token) {
    try {
      const JWT = require("jsonwebtoken");
      //verify token
      console.log(token)
      const JWT_VERIFIED_OBJECT = JWT.verify(
        token,
        process.env.FORGET_SECRET_KEY
      );
      //extact id from JWT_VERIFIED_OBJECT and return
      return JWT_VERIFIED_OBJECT.id;
    } catch (err) {
      console.log("err in verifyResetPasswordToken method in jwt class", err);
      return null;
    }
  }

  //helper method
  async #checkUserExist(email) {
    try {
      const isExist = await this.USER_MODEL.findOne({ email: email });
      if (!isExist) return "";
      return isExist.id;
    } catch (err) {
      console.log("err in JWT TOKEN service class in checkUser method");
      return "";
    }
  }
};
