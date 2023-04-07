const mongoose = require('mongoose');

//Creates the schema for offers in the MongoDB database and the object and the parameters it holds
const order = new mongoose.Schema(
  {
    orderId: {type: String, required: true},
    cart: {type: Object, required: true},
    orderAdress:{type: String, required: true},
    orderAmount: {type: Number, required: true},
    orderedById: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    orderName:{type: String, required: true},
  },
)

module.exports = mongoose.model('Order', order);