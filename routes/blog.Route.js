const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
router.use(bodyParser.json());
const JwtAuthenticatorAdmin = require("../middlewares/authJwtAdmin");
const Blog = require("../providers/services/blog.Services");
const Error = require("../providers/error/error");

//request methods
router.get("/:id", async (req, res) => {
  try {
    const blog = new Blog(req, res);
    return await blog.getBlogFromId();
  } catch (err) {
    console.log("err in blog route", err);
    return new Error(res).internalError();
  }
});

router.get("/page/:page", async (req, res) => {
  try {
    const blog = new Blog(req, res);
    return await blog.getBlogsFromDb();
  } catch (err) {
    console.log(err);
    return new Error(res).internalError();
  }
});

router.get("/admin/page/:page", JwtAuthenticatorAdmin, async (req, res) => {
  try {
    const blog = new Blog(req, res);
    return await blog.getBlogsFromDbForAdmin();
  } catch (err) {
    console.log(err);
    return new Error(res).internalError();
  }
});

router.post("/", JwtAuthenticatorAdmin, async (req, res) => {
  try {
    //business logic consist in blog class
    const blog = new Blog(req, res);
    return await blog.saveBlogInDb();
  } catch (err) {
    return new Error(res).internalError();
  }
});

router.put("/", JwtAuthenticatorAdmin, async (req, res) => {
  try {
    const blog = new Blog(req, res);
    return await blog.updateBlogInDb();
  } catch (err) {
    return new Error(res).internalError();
  }
});

router.delete("/", JwtAuthenticatorAdmin, async (req, res) => {
  try {
    const blog = new Blog(req, res);
    return await blog.deleteBlogInDb();
  } catch (err) {
    return new Error(res).internalError();
  }
});

module.exports = router;
