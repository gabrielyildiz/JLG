//Imports Express.js 
const express = require('express');
const app = express();
//Imports Mongoose 
const mongoose = require('mongoose');
//Imports .env
const dotenv = require('dotenv');
//Imports body parser 
const bodyParser = require('body-parser');
//Imports all the routes from Controller folder
const adminRoute = require('./adminRoute.js');
const startRoute = require('./startRoute.js');
const loginRoute = require('./loginRoute.js');
const registerRoute = require('./registerRoute.js');
const profilePageRoute = require('./profilePageRoute.js');
const addOffersRoute = require('./addOffersRoute.js');
const shoppingCartRoute = require('./shoppingCartRoute.js');
const session = require('express-session');
const allProductsPageRoute = require('./allProductsPageRoute.js');

//Imports EJS layouts
const expressLayouts = require('express-ejs-layouts');
//Imports Passport library
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
//Imports user model
const user = require("../Model/User");

const products = require("../Model/Product")

//Initializes the public folder
app.use(express.static('public'));
//Initializes EJS layouts
app.use(expressLayouts);
//Initializes the url encoded input into the page to be translated so its accesible for JavaScript
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
//Initializes the JSON input into the page to be translated so its accesible for JavaScript
app.use(bodyParser.json());
//Redirects all the routes in the Controller folder to the url that they are under
app.use('/', startRoute);
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/profilePage', profilePageRoute);
app.use('/admin', adminRoute);
app.use('/addOffers', addOffersRoute);
app.use('/shoppingCart', shoppingCartRoute);
app.use('/allProductsPage', allProductsPageRoute);


//Initializes the use of the Passport library
app.use(require("express-session")({
    secret: "Any normal Word",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    secret: 'ssshhhhh', resave: true, saveUninitialized: true, cookie: {
        secure: true
    }
}));
app.get('/public', express.static('public'));
//Initializes EJS so that all the pages in the views folder are rendered 
app.set('view engine', 'ejs');
app.set('View', __dirname + '/layout.ejs');
app.set('View', 'layouts');

//Stores the User id for the user that is logged in to the page at the time
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

//Retrives the User object that is logged in at the moment and finds it through findById() method
passport.deserializeUser(function (id, done) {
    user.findById(id, function (err, user) {
        done(err, user);
    })
});

//Checks with the database if the username and password exists and allows the user to log in
passport.use(new localStrategy(function (username, password, done) {
    user.findOne({ username: username, password: password }, function (err, user) {
        if (err) { return done(err) }
        if (user) { return done(null, user) }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' })
        }
    })
}));

app.get('/search', async (req, res, next) => {
    try {
        const searchProducts = req.query.searchBar;
        await products.findOne({ productName: { $regex: searchProducts, $options: 'i' } })
            .then(product => {
                res.render('productPage', {
                    product: product,
                    user: req.user,
                    session: req.session
                })
            })
    }
    catch (err) {
        res.redirect('/')
        console.log(err)
    }
})

app.get('/:productName', async (req, res) => {
    try {
        await products.findOne({ productName: req.params.productName })
            .then(product => {
                res.render('productPage', {
                    product: product,
                    user: req.user,
                    session: req.session
                })
            })
    }
    catch (err) {
        res.redirect('/')
        console.log(err)
    }
})

app.get('*', function (req, res, next) {
    res.locals.shoppingCartRoute = req.session.shoppingCartRoute;
    next();
})

//Configurates the .env file in the Controller folder and speicifies the path to where it should go
dotenv.config({ path: './Controller/.env' });

//Uses the Mongoose library to connect to the MongoDB database and returns a success message or error to the console
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('DBconnect success')).catch((err) => console.log('error', err));

app.listen(process.env.PORT || 8080);

