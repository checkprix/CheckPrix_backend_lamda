const jwt = require("jsonwebtoken");
require("dotenv").config();
//authentication middleware
module.exports = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const token = cookie.authHeaderCheckprixadmin;

    const decodedToken = jwt.verify(token, process.env.ADMIN_SECRET_KEY); // add secret key
    //console.log(decodedToken)
    //sending userId to next callback method

    if (decodedToken) {
      req.jwtToken = token;
      req.admin_id_From_Jwt = decodedToken.id;
      //console.log("jwt verified");
      //console.log(req.useridFromJwt);
      return next();
    }

    // else {
    //   return res.status(401).json({
    //     is_success: false,
    //     description: "admin is not authorized",
    //   });
    // }
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      is_success: false,
      description: "admin is not authorized",
    });
  }
};
