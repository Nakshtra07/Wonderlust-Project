const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviews.js");
const { reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/Wrapsync.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isreviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js")

//create a review
router.post("/", validateReview,isLoggedIn, wrapAsync(reviewController.submitReview));

//delete that review
router.delete("/:reviewId",isLoggedIn,isreviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;