const bodyParser = require("body-parser");
const express = require("express");
const generateAdmin = require("../methods/generateAdmin");
const router = express.Router();
router.use(bodyParser.json());
const ADMIN_MODEL = require("../models/admin.Model");

const route = router.route("/api/auth/admin/register");

route.post(async (req, res) => {
  try {
    const isAdminFound = await ADMIN_MODEL.findOne({ email: req.body.email });
    if (isAdminFound)
      return res
        .status(200)
        .json({ is_success: false, message: "Admin Already exists !" });

    if (!req?.body?.email || !req?.body?.password)
      return res
        .status(501)
        .json({ is_success: false, message: "Enter email and password !" });

    //generate user object from custom method
    const createAdminObjectForSaveInDB = generateAdmin(
      req.body.email,
      req.body.password
    );

    const isStored = await ADMIN_MODEL.create(createAdminObjectForSaveInDB);
    if (!isStored)
      return res
        .status(200)
        .json({ is_success: false, message: "Account not created!" });

 

    return res
      .status(200)
      .json({ is_success: true, message: "Account created!" });
  } catch (err) {
    console.log(err.message);
    return res
      .status(501)
      .json({ is_success: false, message: "Internal server error !" });
  }
});

module.exports = router;
