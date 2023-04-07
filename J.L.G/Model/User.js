const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

//Creates the schema for offers in the MongoDB database and the pbject and the parameters it holds
const user = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
  },
)

module.exports = mongoose.model('User', user);