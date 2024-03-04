const mongoose = require("mongoose");

const userScheme = new mongoose.Schema(
    {
        id:{
            type:String,
            require:true,
            unique:true
        },
        email:{
            type:String,
            require:true,
            unique:true
        },
        password:{
            type:String,
            require:true,
            unique:false
        },
    
    }
)

const admin = mongoose.model('admin',userScheme);
module.exports = admin;

