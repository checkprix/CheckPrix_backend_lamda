const bcrypt = require("bcryptjs");

module.exports = class Password {
  constructor(req, res) {
    this.REQUEST = req;
    this.RESPONSE = res;
    this.BODY = req.body;
    this.USER_MODEL = require("../../models/users");
    this.ADMIN_MODEL = require("../../models/admin.Model");
    //I used authJwt middleWare where I assiged user id from token // check middleware folder which consist jwtAuth
    this.PARSE_USER_ID_FROM_JWT_TOKEN = req.user_id_From_Jwt;
    this.USER_ID = this.PARSE_USER_ID_FROM_JWT_TOKEN;
    this.ADMIN_ID = req.admin_id_From_Jwt;
  }

  async changePasswordForUser() {
    try {
      const user = await this.USER_MODEL.findOne({ id: this.USER_ID });
      console.log(this.BODY);
      if (!user) {
        return this.RESPONSE.status(401).json({
          is_success: false,
          message: "Incorrect Credenticials",
        });
      }

      const isPasswordMatch = bcrypt.compareSync(
        this.BODY.password,
        user.password
      );

      if (!isPasswordMatch) {
        return this.RESPONSE.status(400).json({
          is_success: false,
          message: "Incorrect Credenticials",
        });
      }

      if (this.BODY.newpassword.length < 8)
        return this.RESPONSE.status(400).json({
          is_success: false,
          message: "Password should be more than 8 characters",
        });
        
      const changedPassword = bcrypt.hashSync(
        this.BODY.newpassword,
        bcrypt.genSaltSync(8),
        12
      );
      await this.USER_MODEL.updateOne(
        { id: this.USER_ID },
        {
          $set: {
            password: changedPassword,
          },
        }
      );

      return this.RESPONSE.status(200).json({
        is_success: true,
        message: "Password changed",
      });
    } catch (err) {
      console.log(err.message);
      return this.RESPONSE.status(401).json({
        is_success: false,
        message: "Incorrect Credenticials",
      });
    }
  }

  async changePasswordForAdmin() {
    try {
      const user = await this.ADMIN_MODEL.findOne({ id: this.ADMIN_ID });
      console.log(this.BODY)
      if (!user) {
        return this.RESPONSE.status(401).json({
          is_success: false,
          message: "Incorrect Credenticials",
        });
      }

      const isPasswordMatch = bcrypt.compareSync(
        this.BODY.password,
        user.password
      );
 

      if (!isPasswordMatch) {
        return this.RESPONSE.status(400).json({
          is_success: false,
          message: "Incorrect Credenticials",
        });
      }
    

      if (this.BODY.newpassword.length < 8)
        return this.RESPONSE.status(400).json({
          is_success: false,
          message: "Password should be more than 8 characters",
        });

      const changedPassword = bcrypt.hashSync(
        this.BODY.newpassword,
        bcrypt.genSaltSync(8),
        12
      );
      await this.ADMIN_MODEL.updateOne(
        { id: this.ADMIN_ID },
        {
          $set: {
            password: changedPassword,
          },
        }
      );

      return this.RESPONSE.status(200).json({
        is_success: true,
        message: "Password changed",
      });
    } catch (err) {
      console.log(err.message);
      return this.RESPONSE.status(401).json({
        is_success: false,
        message: "Incorrect Credenticials",
      });
    }
  }
};
