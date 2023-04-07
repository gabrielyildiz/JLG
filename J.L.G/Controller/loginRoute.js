const express = require("express");
const route = express.Router();
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const user = require("../Model/User");
const { check, validationResult } = require("express-validator");
route.use(require("express-session")({
    secret: "Any normal Word",
    resave: true,
    saveUninitialized: true
}));

route.use(passport.initialize());
route.use(passport.session());
route.use(express.urlencoded({ extended: false }))
//Function that checks if the user is logged out and if he is not logged out it redirects him to the start page
function isLoggedOut(req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.redirect('/')
}

//Checks if the user is logged in and redirects to the login page if not
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    req.session.user = user
    res.redirect('/login')
}

//Routes to the login page and if the user isn't logged in it shows the login page
route.get('/', isLoggedOut, (req, res) => {
    res.render('login', {
        user: req.user,
        session: req.session
    });
});

//Makes logged in user logout
route.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
})

//Post method that takes in the form in login.ejs in the views folder
//Uses the passport library and the passport.use function in config.js in the controller folder
//Redirects to productpage if log in succedes and to start page if log in fails
//Checks if password is more than six charachters and if passord and user field is empty or not
//If password and username is less than six charachters or is empty gives response message
route.post("/",
    check('password', 'Lösenordet måste vara 6 karaktärer').isLength({ min: 6 }),
    check('password', 'Lösenordet måste finnas').notEmpty(),
    check('username', 'Användarnamn måste finnas').notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const alert = errors.array()

            res.render('login', {
                alert
            })
        }
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
        })(req, res, next);
    });

//Exports const route so it useable for other files
module.exports = route