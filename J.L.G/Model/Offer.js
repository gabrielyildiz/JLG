const mongoose = require('mongoose');

//Creates the schema for offers in the MongoDB database and the object and the parameters it holds
const offer = new mongoose.Schema(
  {
    offerPicture: {type: String, required: true},
  },
)

module.exports = mongoose.model('Offer', offer);