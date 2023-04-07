const express = require("express");
const route = express.Router();
const offer = require("../Model/Offer");
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


route.get('/', (req, res) => {
    res.render("addOffers", {
        user: req.user,
        session: req.session
    })
});

// This method posts the data for Offers to the database
route.post('/', uploadImages.single('picture'), async (req, res) => {
    try {
        const createOffer = new offer({
            offerPicture: req.file.filename
        });
        const newOffer = await createOffer.save();
        res.redirect('/')
    } catch (err) {
        console.log(err);
        res.redirect('/addOffers')
    }
});

//Exports const route so it useable for other files
module.exports = route