const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
router.use(bodyParser.json());
const Product = require("./../providers/services/products.Services");
const JwtAuthenticator = require("../middlewares/authJwtAdmin");

const Error = require("../providers/error/error");

router.get("/:id", async (req, res) => {
  try {
    const product = new Product(req,res);
   return await product.getProductById();
  } catch (err) {
    console.log(err);
    return new Error(res).internalError();
  }
});

router.get("/admin/id/:id", async (req, res) => {
  try {
   
    const product = new Product(req,res);
    return await product.getProductByIdAdmin();
  
  } catch (err) {
    console.log(err);
    return new Error(res).internalError();
  }
});

router.get("/page/:page", async (req, res) => {
  try {
    const product = new Product(req,res);
   return await product.getProduct();
  } catch (err) {
    console.log(err);
    return new Error(res).internalError();
  }
});



router.get("/admin/:page",async (req, res) => {
  try {
    console.log('admin')
    const product = new Product(req,res);
   return await product.getProductForAdmin();
  } catch (err) {
    console.log(err);
    return new Error(res).internalError();
  }
});



router.post("/",JwtAuthenticator, async (req, res) => {
  try {
    //business logic consist in blog class
    const product = new Product(req, res);
    //console.log(req.body)
    return await product.saveProductInDb();
  } catch (err) {
    return new Error(res).internalError();
  }
});

router.put("/",JwtAuthenticator, async (req, res) => {
  try {
    const product = new Product(req, res);
    return await product.updateProductInDb();
  } catch (err) {
    console.log(err);
    return new Error(res).internalError();
  }
});

router.delete("/",JwtAuthenticator, async (req, res) => {
  try {
    const product = new Product(req, res);
   return await product.deleteProductFromDb();
  } catch (err) {
    console.log(err);
    return new Error(res).internalError();
  }
});

module.exports = router;
