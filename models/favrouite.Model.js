const mongoose = require("mongoose");

module.exports = mongoose.model(
  "favrouite",
  new mongoose.Schema({
    id: {
      type: String,
      require: true,
      unique: true,
    },
   user_id:{
    type:String,
    require:true,
    unique:true
   },
   favrouite:{
    type:Array
   }
  })
);
