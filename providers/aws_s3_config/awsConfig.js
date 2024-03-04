require("dotenv").config();

class AWS_CONFIG_S3 {
  constructor() {
    this.AWS = require("aws-sdk");
    this.ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
    this.SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
    this.REGION = process.env.REGION;
    this.BUCKET_NAME = process.env.BUCKET_NAME;

  }

   s3ConfigBuiler() {
    this.AWS.config.update({
      accessKeyId: this.ACCESS_KEY_ID,
      secretAccessKey: this.SECRET_ACCESS_KEY,
      region: this.REGION,
    });
    return new this.AWS.S3({ endpoint: "s3.af-south-1.amazonaws.com" });
  }

  async upload(key, file) {
    try {
      if (!file) {
        return null;
      }

      const s3Object =  this.s3ConfigBuiler();
    
      const param = {
        Bucket: this.BUCKET_NAME,
        Key: this.generateRandomNameForFile(key),
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentEncoding: file.encoding,
      };
     
      const response_object = await s3Object.upload(param).promise();
      //console.log(response_object);

      return Promise.resolve({
        link: response_object.Location,
        key: response_object.Key,
      });
    } catch (err) {
      console.error(err);
      console.log("Error in upload method in AWS_CONFIG_S3 class");
      return Promise.reject(null);
    }
  }

  async deleteObjectFromS3(key) {
    const deleteParams = {
      Bucket: this.BUCKET_NAME,
      Key: key,
    };

    const s3Object = this.s3ConfigBuiler();
    return s3Object.deleteObject(deleteParams).promise();
  }

  generateRandomNameForFile(name) {
    const uuid = require("uuid");
    const arr = name.split(".");
    const getLastElement = arr.pop();
    return `${uuid.v4().replace(/-/g, "")}.${getLastElement}`;
  }
}

module.exports = AWS_CONFIG_S3;
