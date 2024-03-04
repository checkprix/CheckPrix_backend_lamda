const bodyParser = require("body-parser");
const express = require("express");

const router = express.Router();
router.use(bodyParser.json());
const Error = require("../providers/error/error");
const JWTauthenticator = require("../middlewares/authJwt");
const Favrouite = require("../providers/services/favrouite.Services");

router.get("/", JWTauthenticator, async (req, res) => {
  try {
    const favrouite = new Favrouite(req, res);
    return await favrouite.getFavrouiteItem();
  } catch (err) {
    console.log(err);
    return new Error(res).internalError();
  }
});

router.put("/", JWTauthenticator, async (req, res) => {
  try {
    const favrouite = new Favrouite(req, res);
    return await favrouite.saveFavrouiteItemForUserInDb();
  } catch (err) {
    console.log(err);
    return new Error(res).internalError();
  }
});

router.delete("/:id", JWTauthenticator, async (req, res) => {
  try {
    const favrouite = new Favrouite(req, res);
    return await favrouite.deleteFavouriteItem();
  } catch (err) {
    console.log(err);
    return new Error(res).internalError();
  }
});

module.exports = router;
