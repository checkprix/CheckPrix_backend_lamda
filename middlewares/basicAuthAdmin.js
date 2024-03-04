const generateAdmin = require("../methods/generateAdmin");
const ADMIN_MODEL = require("../models/admin.Model");
const bcrypt = require("bcryptjs");
require("dotenv").config();
//authentication middleware
module.exports = async (req, res, next) => {
  //  console.log(req.body);

  try {
    //console.log(req.body)
    const is_Default_Admin_Exist =  await isDefaulAdminExist(req);
    if(!is_Default_Admin_Exist) 
      return next();
    
    const admin = await ADMIN_MODEL.findOne({ email: req.body.email });

    if (!admin) {
      return res
        .status(401)
        .json({ is_success: false, message: "Incorrect Credenticials" });
    }

    const isPasswordMatch = bcrypt.compareSync(
      req.body.password,
      admin.password
    );

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ is_success: false, message: "Incorrect Credenticials" });
    }
    //sending admin id to next middleware //attching in req object
    req["admin_id"] = admin.id;

    return next();
  } catch (err) {
    console.log(err.message);
    return res
      .status(401)
      .json({ is_success: false, message: "Incorrect Credenticials" });
  }
};

const isDefaulAdminExist = async (req) => {
 
  const check_Default_admin = await ADMIN_MODEL.findOne({
    email: process.env.DEFAULT_ADMIN_MAIL,
  });
  if (!check_Default_admin) {
    const generate_Admin = generateAdmin(process.env.DEFAULT_ADMIN_MAIL,process.env.DEFAULT_ADMIN_PASSWORD);
    await ADMIN_MODEL.create(generate_Admin);
    req["admin_id"] = generateAdmin.id;
   return false;
  }
  return true;
  
};
