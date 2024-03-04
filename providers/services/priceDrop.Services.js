class PriceDrop {
  constructor(req, res) {
    this.REQUEST = req;
    this.RESPONSE = res;
    this.BODY = req.body;
    this.PRICE_DROP_MODEL = require("../../models/priceDrop.Model");
    this.PRODUCT_MODEL  = require("../../models/priceDrop.Model")
  }

  async getPriceDropProduct() {
    try{
        //importing aggeration class
    const Aggregation = require("../aggeration/aggration");
    //object create
    const aggregation = new Aggregation();
    const pageNumber = parseInt(this.REQUEST.params.page);
    const pageSize = 10; // Assuming 10 items per page
    const skip = (pageNumber - 1) * pageSize;
    //provides price Drop aggregation 
    const price_drop_aggregation = aggregation.priceDropAggregation(skip,pageSize);
    const data = await this.PRICE_DROP_MODEL.aggregate(price_drop_aggregation);
    console.log(data);
    return this.RESPONSE.status(200).json({is_success:true,products:data})

    }
    catch(err)
    {
      console.log('err getPriceDropProduct in pricedrop',err);
      return this.RESPONSE.status(500).json({is_success:false,message:"Internal server error"});
    }
  

  }

  async savePriceDropProductInDb() {
    try {
      const item_id = this.BODY.item_id;
      const isExist = await this.PRICE_DROP_MODEL.findOne({ item_id: item_id });

      //if product already in db
      if (isExist)
        return this.RESPONSE.status(409).json({
          is_success: false,
          message: "Item Already exist",
        });

      //create price drop object which goes save in db
      const priceDropObject = this.#priceDropObjectBuilder(item_id);

      //saving object in db
      const isSaved = await this.PRICE_DROP_MODEL.create(priceDropObject);
      if (isSaved)
        return this.RESPONSE.status(200).json({
          is_success: true,
          message: "Added in price Drop!!",
        });
      throw new Error();
    } catch (err) {
      console.log("err in savePriceDropProductInDb in PriceDrop class");
      console.log(err);
      return this.RESPONSE.status(500).json({
        is_success: false,
        message: "Internal server error",
      });
    }
  }

  async deleteFromPriceList(){
    try{
      const item_id = this.REQUEST.params.id;
      console.log(item_id)
       await this.PRICE_DROP_MODEL.deleteOne({item_id:item_id});
      return this.RESPONSE.status(200).json({is_success:true,message:'Deleted!!!'}); 
    }
    catch(err)
    {
      console.log("err in deleteFromPriceList in price drop class");
      return this.RESPONSE.status(500).json({is_success:false,message:'Internal server error'});
    }
  }

  //helper method
  #priceDropObjectBuilder(item_id) {
    const mongoose = require("mongoose");
    return {
      id: new mongoose.Types.ObjectId().toString(),
      item_id: item_id,
    };
  }
}

module.exports = PriceDrop;