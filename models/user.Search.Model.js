const mongoose = require("mongoose");

module.exports = mongoose.model(
  "user_search",
  new mongoose.Schema({
    id: {
      type: String,
      require: true,
      unique: true,
    },
    search_terms:{
        type:String,
        require:true,
    },

    total_search:{
        type:Number,
        require:true
    }

  })
);
