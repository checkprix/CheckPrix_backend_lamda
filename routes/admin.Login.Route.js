const bodyParser = require("body-parser");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
router.use(bodyParser.json());
const route = router.route("/api/auth/admin/login");
const authenticator = require("../middlewares/basicAuthAdmin");
require("dotenv").config();
//login route
route.post(authenticator, async (req, res) => {
  try {
    //jwt token generate
    const token = jwt.sign(
      { id: req.admin_id, time: new Date() },
      process.env.ADMIN_SECRET_KEY,
      { expiresIn: process.env.JWT_ADMIN }
    );

    return res
      .status(200)
      .cookie("authHeaderCheckprixadmin", token, {
        httpOnly: true,
        secure: process.env.BROWSER === "true" ? true : false,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        sameSite: "none",
        path: "/",
      })

      .json({
        is_success: true,
        message: "admin is Authenticated",
        timestamp: getTimestampHoursAhead(),
      });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ is_success: false, message: "something is wrong" });
  }

  // res.status = 200;
  // res.setHeader("content-type", "application/json");
  // return res.send({ IsSuccess: true,description:"User is Authenticated" });
});

module.exports = router;

function getTimestampHoursAhead() {
  // Get the current time
  let currentTime = new Date();
  console.log(currentTime.getTime());
  // Add 24 hours to the current time
  let futureTime = new Date(currentTime.getTime() + 20 * 60 * 1000);

  // Convert the future time to a Unix timestamp (in milliseconds)
  return futureTime.getTime();
}
