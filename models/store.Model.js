const mongoose = require("mongoose");

module.exports = mongoose.model(
  "store",
  new mongoose.Schema({
    id: {
      type: String,
      require: true,
      unique: true,
    },
   name:{
    type:String,
    require:true,
    
   },
   image:{
    type:Array,
    require:true
   }
  })
);
