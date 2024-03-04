const { default: mongoose } = require("mongoose");
const favrouite_model = require("../../models/favrouite.Model");
const Aggregation = require("../aggeration/aggration");
class Favrouite {
  constructor(req, res) {
    this.REQUEST = req;
    this.RESPONSE = res;
    this.BODY = req.body;
    this.FAVROUITE_MODEL = favrouite_model;
    //I used authJwt middleWare where I assiged user id from token // check middleware folder which consist jwtAuth
    this.PARSE_USER_ID_FROM_JWT_TOKEN = req.user_id_From_Jwt;
    this.USER_ID = this.PARSE_USER_ID_FROM_JWT_TOKEN;
  }

  //get handler
  async getFavrouiteItem() {
    const user_id = this.USER_ID;
    const favrouite_item_aggeration = new Aggregation().favrouiteAggregation(
      user_id
    );
    const items = await this.FAVROUITE_MODEL.aggregate(
      favrouite_item_aggeration
    );
    return this.RESPONSE.status(200).send({
      is_success: true,
      products: items,
    });
  }

  //update handler
  async saveFavrouiteItemForUserInDb() {
    const favrouiteObject = this.#favrouiteObjectBuilder();

   // const favrouiteUpdateObject = this.#favrouiteObjectBuilder(favrouiteObject);
    //  console.log(favrouiteUpdateObject);
    try {
      await this.FAVROUITE_MODEL.findOneAndUpdate(
        {
          user_id: this.USER_ID,
          "favrouite.item_id": { $ne: favrouiteObject.item_id },
        },
        {
          $addToSet: {
            favrouite: favrouiteObject,
          },
        },
        { upsert: true, setDefaultsOnInsert: true, new: true }
      );

      return this.RESPONSE.status(200).json({
        is_success: true,
        message: "Added",
      });
    } catch (err) {

      if(err.code === 11000)
      {
        return this.RESPONSE.status(200).json({
          is_success: true,
          message: "Alredy Exist in favrouite list...!!",
        });
      }

      return this.RESPONSE.status(500).json({
        is_success: true,
        message: "Internals server error",
      });
    }
  }

  //delete handler
  async deleteFavouriteItem() {
    const delete_id = this.REQUEST.params.id;
    console.log(delete_id);
    await this.FAVROUITE_MODEL.updateOne(
      { user_id: this.USER_ID },
      {
        $pull: {
          favrouite: {
            item_id: delete_id,
          },
        },
      }
    );

    return this.RESPONSE.status(200).json({
      is_success: true,
      message: "Removed",
    });
  }

  //helper methods
  #favrouiteObjectBuilder() {
    return {
      id: new mongoose.Types.ObjectId().toString(),
      item_id: this.BODY.item_id,
    };
  }
}

module.exports = Favrouite;
