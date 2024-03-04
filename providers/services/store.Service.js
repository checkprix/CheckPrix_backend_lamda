const { default: mongoose } = require("mongoose");
const AWSCONFIGS3 = require("../aws_s3_config/awsConfig");
const uuid = require("uuid");
const Aggregation = require("../aggeration/aggration");

class Store {
  constructor(req, res) {
    this.REQUEST = req;
    this.RESPONSE = res;
    this.BODY = req.body;
    this.STORE_MODEL = require("../../models/store.Model");
  }

  /*request handlers*/
  async saveStoreInDb() {
    try {
    //create object
      const storeBuilder = this.#storeBuilder();
      //upload image in s3 and get key and link
      const linkAndKeyObject = await new AWSCONFIGS3().upload(
        storeBuilder.file.originalname,
        storeBuilder.file
      );

      //create object using storeBuilderForSaveInDb method which accept link and key in form object which got from s3 resposne
      const saveObjectIntodb = this.#storeBuilderForSaveIndb(linkAndKeyObject);
      //saving store in db
   const store =   await this.STORE_MODEL.create(saveObjectIntodb);
      //response
      return this.RESPONSE.status(200).json({
        is_success: true,
        store:store,
        message: "store Saved !!",
      });
    } catch (err) {
      return this.RESPONSE.status(500).json({
        is_success: false,
        message: "Internal server error",
      });
    }
  }

  async getStoreFromDb() {
    try {
      const store = await this.STORE_MODEL.find({});
      return this.RESPONSE.status(200).json({is_success:true,store:store});
    } catch (err) {
      return this.RESPONSE.status(500).json({
        is_success: false,
        message: "Internal server error !!!",
      });
    }
  }

  async deleteStoreInDb() {
    try {
      const { id, key } = this.REQUEST.query;
      await new AWSCONFIGS3().deleteObjectFromS3(key);
      await this.STORE_MODEL.deleteOne({ id: id });
      return this.RESPONSE.status(200).json({
        is_success: true,
        message: "Store Deleted!!",
      });
    } catch (err) {
      return this.RESPONSE.status(500).json({
        is_success: false,
        message: "Internal server error !!!",
      });
    }
  }

  /*helper methods*/
  #storeBuilder() {
    return {
      ...this.BODY,
      file: this.REQUEST.file,
    };
  }

  #storeBuilderForSaveIndb(linkAndKeyObject) {
    return {
      id: new mongoose.Types.ObjectId().toString(),
      ...this.BODY,
      image: [{ link: linkAndKeyObject.link, key: linkAndKeyObject.key }],
    };
  }
}

module.exports = Store;
