const express = require("express");
const res = require("express/lib/response");
const User = require("../Model/User");
const route = express.Router();
const { check, validationResult } = require("express-validator")

function isLoggedOut(req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.redirect('/')
}


route.get('/', isLoggedOut, (req, res) => {
    res.render('register');
})
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })


// This method creates the User to the database and then posts the data of User to the database
// Checks if the input that the user types in is correct otherwise you get a error message on your screen
route.post('/',
    check('mail', 'Fel format på email').isEmail(),
    check('mail', 'Fel format på email').normalizeEmail(),
    check('password', 'Lösenordet måste vara 6 karaktärer').isLength({ min: 6 }),
    check('phoneNr', 'Telefonnummret måste vara ett nummer').isNumeric(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const alert = errors.array()

            res.render('register', {
                alert
            })
        }
        const createUser = new User({
            username: req.body.userName,
            email: req.body.mail,
            password: req.body.password,
            phoneNumber: req.body.phoneNr,
            name: req.body.nameIn,
            address: req.body.address
        });


        try {
            if (errors.isEmpty()) {
                res.redirect("/")
                const newUser = await createUser.save();
            }
        } catch (err) {
            console.log(err);
        }
    });




//Exports const route so it useable for other files
module.exports = route