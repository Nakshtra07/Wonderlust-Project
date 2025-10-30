const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/Wrapsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const listingcontroller = require("../controllers/listing.js");

router
    .route("/")
    .get(wrapAsync(listingcontroller.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingcontroller.createListing));

//new form
router.get("/addnew", isLoggedIn, listingcontroller.rendernewForm);

router.route("/:id")
    .get(wrapAsync(listingcontroller.showListing))
    .put(isLoggedIn,upload.single('listing[image]'), isOwner,validateListing, wrapAsync(listingcontroller.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingcontroller.deleteListing));

// Edit route (serves the edit form)
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingcontroller.editform));


module.exports = router;