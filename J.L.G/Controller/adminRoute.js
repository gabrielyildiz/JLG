const express = require("express");
const Product = require("../Model/Product");
const route = express.Router();
const user = require("../Model/User");
const product = require("../Model/Product");
const authorization = module.exports = {}
const multer = require("multer");

// Stores images in the public folder
const storeImages = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './public');
    },
    filename: function (request, file, callback) {
        callback(null, new Date().getTime() + '-' + file.originalname);
    },
})

const uploadImages = multer({
    storage: storeImages,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    }
})

// This function checks if the user is an administrator or not
function checkAdmin(req, res, next) {
    let admin = req.user && req.user.isAdmin == true;
    if (!admin) {
        return res.redirect('/')
    }
    next();
}

route.get('/', checkAdmin, (req, res) => {
    res.render('admin', {
        user: req.user,
        session: req.session
    });
})

// This method posts the data for Products to the database
route.post('/', uploadImages.single('picture'), async (req, res) => {
    const createProduct = new Product({
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productCategory: req.body.productCategory,
        productDescription: req.body.productDescription,
        productContent: req.body.productContent,
        productPicture: req.file.filename
    });
    try {
        const newProduct = await createProduct.save();
        res.redirect('/')
    } catch (err) {
        console.log(err);
    }
});

//Exports const route so it useable for other files
module.exports = route
