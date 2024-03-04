const usermodel = require("../models/users");

const md5 = require("md5");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");

const generateUser = (email, password) => {
  return new usermodel({
    id: new mongoose.Types.ObjectId().toString(),
    email: email,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), 12),
  });
};

module.exports = generateUser;
