const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
};

module.exports.rendernewForm = (req, res) => {
    res.render("listings/form.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const particularList = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!particularList) {
        req.flash("error", "Listing you are trying to get does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { particularList });
};

module.exports.createListing = async (req, res, next) => {
    let response = await geoCodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send();
    
    const url = req.file.path;
    const filename = req.file.filename;
    const newList = new Listing(req.body.listing);
    newList.owner = req.user._id;
    newList.image = { url, filename };
    newList.geometry = response.body.features[0].geometry;
    let testres = await newList.save();
    console.log(testres);
    req.flash("success", "new listing is succesfully created");
    res.redirect("/listings");
};

module.exports.editform = async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id);
    if (!data) {
        req.flash("error", "Listing you are trying to get does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = data.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { data, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing has been updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing has been deleted");
    res.redirect("/listings");
};