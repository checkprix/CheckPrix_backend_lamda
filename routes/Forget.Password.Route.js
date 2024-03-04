const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
router.use(bodyParser.json());
const Error_ = require("../providers/error/error");
const ForgetPassword = require("../providers/services/Forget.Password.services");

//post handler responsible for take email from user for reset link process
router.post("/", async (req, res) => {
  try {
    //create Forget password class object // which responsible for forget functionalities
    const forgetPassword = new ForgetPassword(req, res);

    //using verifyUsermail method to verify mail // that valid mail
    const isVerified = await forgetPassword.verifyUserMail();
    //in case mail invalid return false request response
    if (!isVerified)
      return res
        .status(404)
        .json({ is_success: false, message: "Mail does't exists" });

    //in case mail valid send mail to user // by sendRestLinkOfPasswordMailtoUser method which reside forget password
    const response = await forgetPassword.sendRestLinkOfPasswordMailtoUser();
    //if everting goes right res will not null // if it is, throw an error
    if (!response) throw new Error("Err in mail service");
    //return response as it is
    return response;
  } catch (err) {
    console.log(err);
    return new Error_(res).internalError();
  }
});


router.put("/",async (req,res)=>{
  try{
    const forgetPassword = new ForgetPassword(req,res);
    //verifyForgetToken method if it verify token it returns user id
    const user_id = await forgetPassword.verifyForgetToken()
    console.log(user_id)

    //check is it valid
    if(!user_id) throw new Error('token invalid');
    //if valid reset password
  return  await forgetPassword.resetPassword(user_id)
  }
  catch(err)
  {
    let message = "internal service err";
    console.log('err in Forget password service class in put method')
    return res.status(500).json({is_success:false,message:message});
  }
})

module.exports = router;
