const mongoose = require("mongoose");

module.exports = mongoose.model(
  "price_drop",
  new mongoose.Schema({
    id: {
      type: String,
      require: true,
      unique: true,
    },
    item_id:{
    type:String,
    require:true,
    unique:true
   },
   
  })
);
