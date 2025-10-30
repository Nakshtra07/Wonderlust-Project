const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.submitReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newRev = new Review(req.body.review);
    newRev.author = req.user._id;
    console.log(newRev);
    listing.reviews.push(newRev);
    await newRev.save();
    await listing.save();
    req.flash("success", "Review created.");
    res.redirect(`/listings/${req.params.id}`)
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review is Deleted");
    res.redirect(`/listings/${id}`);
};