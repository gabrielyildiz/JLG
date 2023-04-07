const mongoose = require('mongoose');

//Creates the schema for products in the MongoDB database and the object and the parameters it holds
const product = new mongoose.Schema(
  {
    productName: { type: String, required: true,},
    productPrice: { type: Number, required: true},
    productCategory: { type: String, required: true},
    productDescription: { type: String, required: true },
    productContent: {type: String, required: true},
    productPicture: {type: String, required: true},
  },
)

module.exports = mongoose.model('Product', product);