const { Router } = require("express");
const express = require("express");
const route = express.Router();
const user = require("../Model/User")
const orders = require("../Model/Order");

route.get('/', (req, res) => {
    try {
        orders.find({ orderedById: req.user.id }, function (err, orders) {
            res.render('profilePage',
                {
                    orders: orders,
                    user: req.user,
                    session: req.session
                });
        })
    }
    catch (err) {
        res.redirect('/')
        console.log(err)

    }
})

module.exports = route
