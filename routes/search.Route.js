const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
router.use(bodyParser.json());
const Error = require("../providers/error/error");
//const PRODUCT_MODEL = require("../models/products.Model");
router.get("/", async (req, res) => {
  try {
    //import serach class
    const Search = require("../providers/services/search.Services");

    // creted search class object and call SearchProductForUser() method
    //which return data
    return await new Search(req, res).SearchProductForUser();
  } catch (err) {
    console.log("err in search Route", err);
    return new Error(res).internalError();
  }
});

router.get("/similar/products", async (req, res) => {
  try {
    //import serach class
    const Search = require("../providers/services/search.Services");

    // creted search class object and call SearchProductForUser() method
    //which return data
    return await new Search(req, res).similarProducts();
  } catch (err) {
    console.log("err in search Route", err);
    return new Error(res).internalError();
  }
});

module.exports = router;
