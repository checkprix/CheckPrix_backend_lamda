const jwt = require("jsonwebtoken");
require('dotenv').config()
//authentication middleware
module.exports = async (req, res, next) => {
  try {
   
    const cookie = req.cookies;
    const token = cookie.authHeaderCheckprix;

 

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // add secret key
    //console.log(decodedToken)
    //sending userId to next callback method

    if (decodedToken) {
      req.jwtToken = token; 
      req.user_id_From_Jwt = decodedToken.id;
      //console.log("jwt verified");
      //console.log(req.useridFromJwt);
      return next();
    } 
  } catch (err) {
    return res.status(401).send({
      is_success: false,
      description: "User is not authorized",
    });
  }
};
