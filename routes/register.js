const userModel = require("../models/users");
const bodyParser = require("body-parser");
const express = require("express");
const generateUser = require("../methods/generateUser");
const jwt = require("jsonwebtoken");
// const verifyOtp = require("../methods/verifyOtp");
const router = express.Router();
router.use(bodyParser.json());


const route = router.route("/api/auth/register");

route.post(async (req, res) => {
  try {
    console.log(req.body)
    const isUserFound = await userModel.findOne({ email: req.body.email });
    if (isUserFound)
      return res
        .status(200)
        .json({ is_success: false, message: "User Already exists !" });

    if (!req?.body?.email || !req?.body?.password)
      return res
        .status(501)
        .json({ is_success: false, message: "Enter email and password !" });

    //generate user object from custom method
    const createUserObjectForSaveInDB = generateUser(
      req.body.email,
      req.body.password
    );

    const isStored = await userModel.create(createUserObjectForSaveInDB);
    if (!isStored)
      return res
        .status(200)
        .json({ is_success: false, message: "Account not created!" });

    const token = jwt.sign(
      { id: req.user_id, time: new Date() },
      process.env.SECRET_KEY,
      { expiresIn: 24 * 60 * 60 * 1000 }
    );

    return res
      .status(200)
      .cookie("authHeaderCheckprix", token, {
        httpOnly: true,
        secure: process.env.BROWSER === "true" ? true : false,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        sameSite: "none",
        path: "/",
      })
      .json({ is_success: true, message: "Account created!" });
  } catch (err) {
    console.log(err.message);
    return res
      .status(501)
      .json({ is_success: false, message: "Internal server error !" });
  }
});

module.exports = router;
