const mongoose = require("mongoose");

module.exports = mongoose.model(
  "products",
  new mongoose.Schema({
    id: {
      type: String,
      require: true,
      unique: true,
    },

    old_price:{
      type:Number,
      require:true
    },

    new_price:{
      type:Number,
      require:true
    },

    listing:{
      type:Number,
      require:true
    },

    store_link:{
      type:String,
      require:true
    },

    store:{
      type:Array,
      require:true
    },
    details: {
      type: Object,
      require: true,
    },

    image: {
      type: Array,
      require: true,
    },

    created_at: {
      type: String,
      require: true,
    },
  })
);
