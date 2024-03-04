const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
router.use(bodyParser.json());
const jwtUserAuth = require("../middlewares/authJwt");
const jwtAdminAuth = require("../middlewares/authJwtAdmin");
const Error = require("../providers/error/error");
const Password = require("../providers/services/Passoword.Services");


router.put('/user',jwtUserAuth, async (req, res) => {
  try {
    console.log(req.body)
    const pasword = new Password(req, res);
    return await pasword.changePasswordForUser();
  } catch {
    console.log("err in password route", err);
    return new Error(res).internalError();
  }
});

router.put('/admin',jwtAdminAuth, async (req, res) => {
    try {
      console.log(req.body)
      const pasword = new Password(req, res);
      return await pasword.changePasswordForAdmin();
    } catch {
      console.log("err in password route", err);
      return new Error(res).internalError();
    }
  });

module.exports = router;
