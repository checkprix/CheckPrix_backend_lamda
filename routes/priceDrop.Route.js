const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
router.use(bodyParser.json());
const JwtAutthenticator = require("../middlewares/authJwtAdmin");
const Error = require("../providers/error/error");
const PriceDrop = require("../providers/services/priceDrop.Services");

router.get("/page/:page",async (req, res) => {
  try {
    const priceDrop = new PriceDrop(req,res);
    await priceDrop.getPriceDropProduct();
  } catch (err) {
    console.log("err in price Drop route in get requets", err);
    return new Error(res).internalError();
  }
});

router.post("/", JwtAutthenticator,async (req, res) => {
  try {
    const priceDrop = new PriceDrop(req,res);
    await priceDrop.savePriceDropProductInDb();

  } catch (err) {
    console.log("err in price Drop route in post request", err);
    return new Error(res).internalError();
  }
});

router.delete('/:id',JwtAutthenticator,async(req,res)=>{
 
  try {
    const priceDrop = new PriceDrop(req,res);
    await priceDrop.deleteFromPriceList();

  } catch (err) {
    console.log("err in price Drop route in delete request", err);
    return new Error(res).internalError();
  }

})

module.exports = router;
