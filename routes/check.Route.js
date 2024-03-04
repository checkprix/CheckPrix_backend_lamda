const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
router.use(bodyParser.json());
const Error = require("../providers/error/error");


router.get("/",async (req,res)=>{
  try{
   
    return res.status(200).json({is_success:true,message:"working"})
  }
  catch(err)
  {
    console.log(err)
    return new Error(res).internalError();
  }

})



module.exports = router;
