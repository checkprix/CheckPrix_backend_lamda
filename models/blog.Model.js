const mongoose = require("mongoose");

module.exports = mongoose.model(
  "blogs",
  new mongoose.Schema({
    id: {
      type: String,
      require: true,
      unique: true,
    },
    title: {
      type: String,
      require: true,
      unique: false,
    },
    description: {
      type: String,
      require: true,
      unique: false,
    },
    detail:{
        type:String
    },
    image:{
        type:Array
    },
    created_at:{
      type:String,
      require:true

    }
  })
);
