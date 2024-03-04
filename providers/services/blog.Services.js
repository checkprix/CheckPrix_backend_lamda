const { default: mongoose } = require("mongoose");
const blogModel = require("../../models/blog.Model");
const AWSCONFIGS3 = require("../aws_s3_config/awsConfig");
const uuid = require("uuid");
const Aggregation = require("../aggeration/aggration");

class Blog {
  constructor(req, res) {
    this.REQUEST = req;
    this.RESPONSE = res;
    this.BODY = req.body;
    this.BLOG_MODEL = blogModel;
    this.IMAGE_VALIDATOR = require("../validators/Image.Validator");
  }

  /*request handlers*/
  async getBlogsFromDb() {
    const pageNumber = parseInt(this.REQUEST.params.page);
    console.log(pageNumber);

    const pageSize = 10; // Assuming 10 items per page
    const skip = (pageNumber - 1) * pageSize;
    const blogPerPageAggeration = new Aggregation().AggregationForPerPageBlog(
      skip,
      pageSize
    );
    const blogs = await this.BLOG_MODEL.aggregate(blogPerPageAggeration);
    return this.RESPONSE.status(200).json({ is_success: true, blogs: blogs });
  }

  async getBlogsFromDbForAdmin() {
    const pageNumber = parseInt(this.REQUEST.params.page);
    console.log(pageNumber);

    const pageSize = 10; // Assuming 10 items per page
    const skip = (pageNumber - 1) * pageSize;
    const blogPerPageAggeration =
      new Aggregation().AggregationForPerPageBlogForAdmin(skip, pageSize);
    const blogs = await this.BLOG_MODEL.aggregate(blogPerPageAggeration);
    return this.RESPONSE.status(200).json({ is_success: true, blogs: blogs });
  }

  async getBlogFromId() {
    try {
      const param = this.REQUEST.params.id;
      const blog = await this.BLOG_MODEL.findOne({ id: param });
      return this.RESPONSE.status(200).json({ is_success: true, blog: blog });
    } catch (err) {
      console.log("err in getBlogsFromDb method blog service class", err);
      return this.RESPONSE.status(500).json({
        is_success: false,
        message: "Internal server error",
      });
    }
  }

  async saveBlogInDb() {
    //blogBuilder method returns body and file in form of object
    const blogBuilderObject = this.#blogBuilder();

    //validate file should image
    const imageValidator = new this.IMAGE_VALIDATOR();
    imageValidator.validateImageExtension(
      blogBuilderObject.file.originalname || null
    );

    //uploading image to s3 and return key and link (location)
    const linkAndKeyObject = await new AWSCONFIGS3().upload(
      blogBuilderObject.file.originalname,
      blogBuilderObject.file
    );

    //#BlogBuilderForSaveIndb method return a object which goes to save in db
    const saveObjectIntodb = this.#BlogBuilderForSaveIndb(linkAndKeyObject);

    //save in db
    await this.BLOG_MODEL.create(saveObjectIntodb);
    //response
    return this.RESPONSE.status(200).json({
      is_success: true,
      message: "Blog Saved !!",
    });
  }

  async updateBlogInDb() {
    //blogBuilder method returns body and file in form object
    const blogBuilderObject = this.#blogBuilder();

      //validate file should image
      const imageValidator = new this.IMAGE_VALIDATOR();
      imageValidator.validateImageExtension(
        blogBuilderObject.file.originalname || null
      );

    const image_key = await this.#getkeyforImage();

    //uploading image to s3 and return link (location)
    //using image_key so I can overWrite the file in s3
    const linkAndKeyObject = await new AWSCONFIGS3().upload(
      image_key,
      blogBuilderObject.file
    );

    //#BlogBuilderForUpdateIndb method return a object which goes to update in db
    const updateObjectIntodb = await this.#BlogBuilderForUpdateIndb(
      linkAndKeyObject
    );

    await this.BLOG_MODEL.updateOne(
      { id: this.BODY.id },
      {
        ...updateObjectIntodb,
        id: this.BODY.id,
        created_at: this.BODY.created_at,
      }
    );
    return this.RESPONSE.status(200).json({
      is_success: true,
      message: "Blog Updated !!",
    });
  }

  async deleteBlogInDb() {
    const { id, key } = this.REQUEST.query;
    await new AWSCONFIGS3().deleteObjectFromS3(key);
    await this.BLOG_MODEL.deleteOne({ id: id });
    return this.RESPONSE.status(200).json({
      is_success: true,
      message: "Blog Deleted!!",
    });
  }

  /*helper methods*/
  #blogBuilder() {
    return {
      ...this.BODY,
      file: this.REQUEST.file,
    };
  }

  #BlogBuilderForSaveIndb(linkAndKeyObject) {
    return {
      id: new mongoose.Types.ObjectId().toString(),
      ...this.BODY,
      created_at: new Date().getTime(),
      image: [{ link: linkAndKeyObject.link, key: linkAndKeyObject.key }],
    };
  }

  async #BlogBuilderForUpdateIndb(linkAndKeyObject) {
    if (!linkAndKeyObject) {
      const blog = await this.BLOG_MODEL.findOne({ id: this.BODY.id });
      linkAndKeyObject = {
        link: blog.image[0].link,
        key: blog.image[0].key,
      };
    }

    return {
      ...this.BODY,
      image: [{ link: linkAndKeyObject.link, key: linkAndKeyObject.key }],
    };
  }

  async #getkeyforImage() {
    const blogModel = require("../../models/blog.Model");
    const blog = await blogModel.findOne({ id: this.BODY.id });
    const keys = blog.image[0].key;
    return Promise.resolve(keys);
  }
}

module.exports = Blog;
