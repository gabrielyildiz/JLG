const express = require("express");
const route = express.Router();
const products = require("../Model/Product")
const user = require("../Model/User");
const order = require("../Model/Order")
const dotenv = require('dotenv');
dotenv.config({ path: './Controller/.env' });
const Publishable_Key = process.env.Publishable_Key
const Secret_Key = process.env.Secret_Key
const stripe = require('stripe')(Secret_Key)
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

//Routes to the product page and renders shoppingCart in views folder
route.get('/:productName', function (req, res) {
    var name = req.params.productName;
    products.findOne({ productName: name }, function (err, p) {
        if (err)
            console.log(err);

        if (typeof req.session.shoppingCartRoute == 'undefined') {
            req.session.shoppingCartRoute = [];
            req.session.shoppingCartRoute.push({
                productName: p.productName,
                qty: 1,
                productPrice: p.productPrice,
            });
        }
        else {

            var newItem = true;
            var name = req.params.productName

            for (var i = 0; i < req.session.shoppingCartRoute.length; i++) {
                if (req.session.shoppingCartRoute[i].productName == name) {
                    req.session.shoppingCartRoute[i].qty++;
                    newItem = false;
                    break;
                }
            }
            if (newItem) {
                req.session.shoppingCartRoute.push({
                    productName: name,
                    qty: 1,
                    productPrice: p.productPrice,
                });


            }
        }
        res.redirect('back');
    });
});

route.get('/', (req, res) => {
    res.render('shoppingCart', {
        cart: req.session.shoppingCartRoute,
        key: Publishable_Key,
        user: req.user, session: req.session,
    });
})

route.post('/payment', function (req, res) {

    req.session.shoppingCartRoute.forEach(product => {
        var totalPrice = product.qty * product.productPrice;
        stripe.charges.create({
            amount: totalPrice * 100,
            description: 'J.L.G',
            currency: 'sek',
            source: req.body.stripeToken,
        },
            function (err, charge) {
                if (err) {
                    console.log(err)
                }
                var orders = new order({
                    orderedById: req.user,
                    cart: req.session.shoppingCartRoute,
                    orderAdress: req.user.address,
                    orderAmount: totalPrice,
                    orderId: charge.id,
                    orderName: req.user.name,

                });
                try {
                    orders.save(function (err, result) {
                        orders.save();
                        req.session.shoppingCartRoute = undefined;
                        res.redirect('/');

                    });
                } catch (err) {
                    console.log(err)
                }
            });
    })
})

route.post('/paymentWithoutLogin', function (req, res) {

    req.session.shoppingCartRoute.forEach(product => {
        var totalPrice = product.qty * product.productPrice;
        stripe.charges.create({
            amount: totalPrice * 100,    // Charing Rs 25
            description: 'J.L.G',
            currency: 'sek',
            source: req.body.stripeToken,
        },
            function (err, charge) {
                if (err) {
                    console.log(err)
                }
                var users = new user({
                    username: req.body.userName,
                    email: req.body.mail,
                    password: req.body.password,
                    phoneNumber: req.body.phoneNr,
                    name: req.body.nameIn,
                    address: req.body.address,
                })
                var orders = new order({

                    cart: req.session.shoppingCartRoute,
                    orderAdress: req.body.address,
                    orderAmount: totalPrice,
                    orderId: charge.id,
                    orderName: req.body.nameIn,
                })
                try {
                    orders.save(function (err, result) {
                        users.save();
                        orders.save();
                        req.session.shoppingCartRoute = undefined;
                        res.redirect('/')
                    });
                } catch (err) {
                    console.log(err)
                }
            });
    })

})


//Exports const route so it useable for other files
module.exports = route