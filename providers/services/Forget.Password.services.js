module.exports = class ForgetPassword {
  constructor(req, res) {
    this.REQUEST = req;
    this.RESPONSE = res;
    this.BODY = req.body;
    //import Jwt Class
    this.JWT_SERVICE = require("../JWT.Service/Jwt.Services");
    //import USER MODEL
    this.USER_MODEL = require("../../models/users");

    //import Email class
    this.EMAIL_SERVICE = require("../Email.Services/Email.Services");

    this.USER_EMAIL = "";
  }

  //this method verify the user mail // that exist or not
  async verifyUserMail() {
    try {
      //checking mail of user
      const isMailExist = await this.USER_MODEL.findOne({
        email: this.BODY.email,
      });
      //if does not exist return false request
      if (!isMailExist) return false;
      this.USER_EMAIL = isMailExist.email;
      return true
    } catch (err) {
      console.log(err.message);
      return this.RESPONSE.status(501).json({
        is_success: false,
        message: "internal server error",
      });
    }
  }

  async sendRestLinkOfPasswordMailtoUser() {
    try {
      //create jwt class object which responsible for jwt token service like generate token and verify token
      const JwtService = new this.JWT_SERVICE(this.USER_EMAIL);
      //call GenerateTokenForRestPassword method to generate forget password token which goes with mail
      const token = await JwtService.GenerateTokenForRestPassword();
     
      // create email class object which resposible for actual mail service like send mail
      const emailService = new this.EMAIL_SERVICE(this.USER_EMAIL, token);
      //return response
      const res = await emailService.sendForgetPasswordEmailToUser();
      if (!res) throw new Error("");
      return await this.RESPONSE.status(200).json({
        is_success: true,
        message: "Mail sent your mail address!!!",
      });
    } catch (err) {
      console.log(
        "err in sendRestLinkOfPasswordMailtoUser method in Forget password class",
        err
      );
      return this.RESPONSE.status(501).json({
        is_success: false,
        message: "internal server error",
      });
    }
  }

  async verifyForgetToken() {
    try {
      const JWT_SERVICE = require('../JWT.Service/Jwt.Services')
      const token = this.BODY.token;
     
      const user_id =  JWT_SERVICE.verifyResetPasswordToken(token);
      return user_id;
    } catch (err) {
      console.log("err in verifyForgetToken method in Forget Password", err);
      return null;
    }
  }

  async resetPassword(user_id)
  {
    try{
    const bcrypt = require("bcryptjs");
    console.log(user_id)
    let reset_password = bcrypt.hashSync(this.BODY.password, bcrypt.genSaltSync(8), 12);
    const isRest = await this.USER_MODEL.updateOne({id:user_id},{
      $set:{password:reset_password}
    });
    if(!isRest) return await this.RESPONSE.status(500).json({is_success:false,message:"Internal server error !"});

    return await this.RESPONSE.status(200).json({is_success:true,message:"Password reset!!!"});
  }
  catch(err)
  {
    console.log('err in resetPassword method in Forget password Service class',err);
    return await this.RESPONSE.status(500).json({is_success:false,message:"Internal server error !"});
  }

  }
};
