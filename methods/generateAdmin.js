const adminModel = require("../models/admin.Model");

const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");

const generateAdmin = (email, password) => {
  return new adminModel({
    id: new mongoose.Types.ObjectId().toString(),
    email: email,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), 12),
  });
};

module.exports = generateAdmin;
