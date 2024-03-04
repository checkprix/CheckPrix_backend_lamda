const users = require('../models/users')
const bcrypt = require("bcryptjs");

//authentication middleware
module.exports = async (req, res, next)=> {
    console.log(req.body);

    try {
 
        const user = await users.findOne({ email: req.body.email });
    
        if (!user) {
          return res.status(401).json({  is_success:false,message: "Incorrect Credenticials" });
        }
    
        const isPasswordMatch = bcrypt.compareSync(req.body.password, user.password);
    
        if (!isPasswordMatch) {
          return res.status(401).json({ is_success:false,message: "Incorrect Credenticials" });
        }

        //sending user id to next middleware //attching in req object
        req['user_id'] = user.id;
       
        return next();
     
}
catch(err)
{
  console.log(err.message)
    return res.status(401).json({ is_success:false,message: "Incorrect Credenticials" });
}

}


