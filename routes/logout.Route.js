const bodyParser = require("body-parser");
const express = require("express");
const logoutRoute = express.Router();
logoutRoute.use(bodyParser.json());
const route = logoutRoute.route("/api/logout");

route.get(async (req, res) => {
  try {
    
    res.status(200).send({ is_success: true, message: "Logged Out!" });

    // res.status(200).send({ IsRequestSuccess: true, message: "working!" });
  } catch (err) {
    console.log(err.message);
    return res
      .status(505)
      .send({ is_success: false, message: "Something is wrong" });
  }
});

module.exports = logoutRoute;
