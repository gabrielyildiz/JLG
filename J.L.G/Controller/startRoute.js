const express = require("express");
const route = express.Router();
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
route.use(require("express-session")({
    secret: "Any normal Word",
    resave: true,
    saveUninitialized: true
}));
route.use(passport.initialize());
route.use(passport.session());
const offers = require("../Model/Offer")
const products = require("../Model/Product");

//Checks if the user is logged in and redirects to the login page if not
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/')
}

//Routes to the start page and uses the takes in offers, products and user objects
route.get('/', (req, res) => {
    offers.find({}, function (err, offer) {
        products.find({}, function (err, product) {
            res.render('start', { product: product, offer: offer, user: req.user, session: req.session });
        }).limit(5).sort({ '_id': -1 })
    }).sort({ '_id': -1 })
});

//Exports const route so it useable for other files
module.exports = route