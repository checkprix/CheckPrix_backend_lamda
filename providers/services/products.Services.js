const { default: mongoose } = require("mongoose");
const AWS_CONFIG_S3 = require("../aws_s3_config/awsConfig");
const uuid = require("uuid");
const Aggregation = require("../aggeration/aggration");
class Product {
  constructor(req, res) {
    this.REQUEST = req;
    this.RESPONSE = res;
    this.BODY = req.body;
    this.PRODUCT_MODEL = require("../../models/products.Model");
    this.PRICE_DROP_MODEL = require("../../models/priceDrop.Model");
    this.IMAGE_VALIDATOR = require("../validators/Image.Validator")
  }

  //get handler

  async getProductByIdAdmin() {
    try {
      const id = this.REQUEST.params.id;
      
      const product = await this.PRODUCT_MODEL.findOne({id:id});
      return this.RESPONSE.status(200).json({
        is_success: true,
        product: product,
      });
    } catch (err) {
      return this.RESPONSE.status(500).json({
        is_success: false,
        message: "Internal server error!!",
      });
    }
  }

  async getProductById() {
    try {
      const id = this.REQUEST.params.id;
      const aggregationForProductPage = new Aggregation().AggregationForProductPage(id);
      const product = await this.PRODUCT_MODEL.aggregate(aggregationForProductPage);
      return this.RESPONSE.status(200).json({
        is_success: true,
        product: product,
      });
    } catch (err) {
      return this.RESPONSE.status(500).json({
        is_success: false,
        message: "Internal server error!!",
      });
    }
  }

  async getProduct() {
    try {
      const pageNumber = parseInt(this.REQUEST.params.page);
      console.log(pageNumber);

      const pageSize = 10; // Assuming 10 items per page
      const skip = (pageNumber - 1) * pageSize;
      const AggregationForPerPageProduct =
        new Aggregation().AggregationForPerPageProduct(skip, pageSize);
      const products = await this.PRODUCT_MODEL.aggregate(
        AggregationForPerPageProduct
      );

      return this.RESPONSE.status(200).json({
        is_success: true,
        products: products,
      });
    } catch (err) {
      console.log("Error in getProduct in product class", err);
      return this.RESPONSE.status(500).json({
        is_success: false,
        message: "Internal server error!!",
      });
    }
  }

  async getProductForAdmin() {
    try {
      const pageNumber = parseInt(this.REQUEST.params.page);
      console.log(pageNumber);

      const pageSize = 10; // Assuming 10 items per page
      const skip = (pageNumber - 1) * pageSize;
      const AggregationForPerPageProductForAdmin =
        new Aggregation().AggregationForPerPageProductForAdmin(skip, pageSize);
      const products = await this.PRODUCT_MODEL.aggregate(
        AggregationForPerPageProductForAdmin
      );

      return this.RESPONSE.status(200).json({
        is_success: true,
        products: products,
      });
    } catch (err) {
      console.log("Error in getProductForAdmin in product class", err);
      return this.RESPONSE.status(500).json({
        is_success: false,
        message: "Internal server error!!",
      });
    }
  }

  //post handler
  async saveProductInDb() {
    try {
      //#BodyAndFileBuilder method returns body and file in form of object
      console.log(this.BODY);
      console.log(this.REQUEST);
      const BodyAndFile = this.#BodyAndFileBuilder();

      //validate file should image
     const imageValidator = new this.IMAGE_VALIDATOR();
     imageValidator.validateImageExtension(BodyAndFile.file.originalname || null);

      //uploading image to s3 and return key and link (location)

      console.log(BodyAndFile.file);
      const linkAndKeyObject = await new AWS_CONFIG_S3().upload(
        BodyAndFile.file.originalname,
        BodyAndFile.file
      );

      //#ProductBuilderForSaveIndb method return a object which goes to save in db

      const saveObjectIntodb =
        this.#ProductBuilderForSaveIndb(linkAndKeyObject);

      //save in db

      await this.PRODUCT_MODEL.create(saveObjectIntodb);

      //return resposne with product saved id
      return this.RESPONSE.status(200).json({
        is_success: true,
        message: "Product Saved !!",
        product_id: saveObjectIntodb.id,
      });
    } catch (err) {
      console.log("err in saveProductInDb in product class", err);
      return this.RESPONSE.status(500).json({
        is_success: false,
        message: "Internal server error!!",
      });
    }
  }

  //update handler
  async updateProductInDb() {
    try {
      //#BodyAndFileBuilder method returns body and file in form object
      const BodyAndFile = this.#BodyAndFileBuilder();

     //validate file should image
     const imageValidator = new this.IMAGE_VALIDATOR();
     imageValidator.validateImageExtension(BodyAndFile.file.originalname || null);

      //get image key from db for update
      // because in aws s3 you can't be update object but you can overwrite so on using name key I have overwrited object
      const image_key = await this.#getkeyforImage();

      //uploading image to s3 and return link (location) and key
      //using image_key so I can overWrite the file in s3
      const linkAndKeyObject = await new AWS_CONFIG_S3().upload(
        image_key,
        BodyAndFile.file
      );

      //BlogBuilderForSaveIndb method return a object which goes to save in db
      const saveObjectIntodb =
       await this.#ProductBuilderForUpdateInDb(linkAndKeyObject);
        console.log("YES",saveObjectIntodb)
      //update in db
      await this.PRODUCT_MODEL.updateOne(
        { id: this.BODY.id },
        {
          ...saveObjectIntodb,
        }
      );

      //return response
      return this.RESPONSE.status(200).json({
        is_success: true,
        message: "Product Updated !!",
      });
    } catch (err) {
      console.log("err in updateProductInDb in product class", err);
      return this.RESPONSE.status(500).json({
        is_success: false,
        message: "Internal server error!!",
      });
    }
  }

  async deleteProductFromDb() {
    const mongo_session = await mongoose.startSession();
    mongo_session.startTransaction();
    try {
      const { id, key } = this.REQUEST.query;

      await this.PRODUCT_MODEL.deleteOne({ id: id });
      await this.PRICE_DROP_MODEL.deleteOne({ item_id: id });
      await new AWS_CONFIG_S3().deleteObjectFromS3(key);
      await mongo_session.commitTransaction();
      return this.RESPONSE.status(200).json({
        is_success: true,
        message: "Product Deleted!!",
      });
    } catch (err) {
      await mongo_session.abortTransaction();
      console.log("err in deleteProductFromDb");
      return new Error(res).internalError();
    } finally {
      mongo_session.endSession();
    }
  }

  //hepler method
  #BodyAndFileBuilder() {
    return {
      ...this.BODY,
      file: this.REQUEST.file,
    };
  }

  #ProductBuilderForSaveIndb(linkAndKeyObject) {
    const mongoose = require("mongoose");
    const clone_body = { ...this.BODY };
    const { old_price, new_price, listing,store_link,store } = clone_body;
    delete clone_body.old_price;
    delete clone_body.new_price;
    delete clone_body.listing;
    delete clone_body.store_link;
    delete clone_body.store;
    return {
      id: new mongoose.Types.ObjectId().toString(),
      details: {
        ...clone_body,
      },
      old_price: old_price,
      new_price: new_price,
      listing: listing,
      store_link:store_link,
      store:store,
      created_at: new Date().getTime(),
      image: [{ link: linkAndKeyObject.link, key: linkAndKeyObject.key }],
    };
  }

 async #ProductBuilderForUpdateInDb(linkAndKeyObject) {
    let cloneOfBody = { ...this.BODY };
    const { old_price, new_price, listing,store_link,store } = cloneOfBody;
    delete cloneOfBody.id;
    delete cloneOfBody.old_price;
    delete cloneOfBody.new_price;
    delete cloneOfBody.listing;
    delete cloneOfBody.store_link;
    delete cloneOfBody.store;
    if(!linkAndKeyObject)
    {
      const getExistingKeyAndLink = await this.PRODUCT_MODEL.findOne({id:this.BODY.id});
      console.log(getExistingKeyAndLink)
      linkAndKeyObject = {
        link:getExistingKeyAndLink.image[0].link,
        key:getExistingKeyAndLink.image[0].key
      }
    }

    return {
      id: this.BODY.id,
      details: {
        ...cloneOfBody,
      },
      old_price: old_price,
      new_price: new_price,
      listing: listing,
      store_link:store_link,
      store:store,
      created_at: this.BODY.created_at,
      image: [{ link: linkAndKeyObject.link, key: linkAndKeyObject.key }],
    }
  }

  async #getkeyforImage() {
    const product = await this.PRODUCT_MODEL.findOne({ id: this.BODY.id });
    // console.log(product)
    const keys = product.image[0].key;
    return Promise.resolve(keys);
  }
}

module.exports = Product;
