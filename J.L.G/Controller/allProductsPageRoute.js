const express = require("express");
const route = express.Router();
const products = require("../Model/Product")

//Routes to the product page and renders productPage in views folder
route.get('/', function (req, res) {
    products.find(function (err, product) {
        if (err)
            console.log(err);

        res.render('allProductsPage', {
            product: product,
            user: req.user,
            session: req.session
        });
    })
})

//Exports const route so it useable for other files
module.exports = route