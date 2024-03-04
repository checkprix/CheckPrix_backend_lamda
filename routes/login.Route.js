const userModel = require("../models/users");
const bodyParser = require("body-parser");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
router.use(bodyParser.json());
const route = router.route("/api/auth/login");
const authenticator = require('../middlewares/basicAuth')
//const {connectToDb,disconnectToDb} = require('../mongoConfig/connection')
require('dotenv').config()
//login route
route.post(authenticator, async (req, res) => {
  
  //jwt token generate
  try {
    
    const token =  jwt.sign(
      { id: req.user_id, time: new Date() },
      process.env.SECRET_KEY,
      { expiresIn:  process.env.JWT_USER }
    );
 

   return res
      .status(200)
      .cookie('authHeaderCheckprix', token, {
        httpOnly: true, secure: process.env.BROWSER === "true"? true :false,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), sameSite: 'none', path: '/'
      })

      .send({ is_success: true, message: "User is Authenticated" });
  } catch (err) {
   
    console.log(err.message)
    return res
      .status(500)
      .send({ is_success: false, message: "something is wrong" });
  }

  // res.status = 200;
  // res.setHeader("content-type", "application/json");
  // return res.send({ IsSuccess: true,description:"User is Authenticated" });
});

module.exports = router;
