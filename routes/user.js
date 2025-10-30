const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/Wrapsync.js");
const passport = require("passport");
const { saveRedirecturl } = require("../middleware.js");

const userController = require("../controllers/user.js")

//render signup form
router.get("/signup", userController.signupFrom);


//signup form submission
router.post("/signup", wrapAsync(userController.Signup));


//render login form
router.get("/login", userController.renderloginForm);


//login form submission
router.post("/login", saveRedirecturl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), 
userController.submitLoginDetails);

//logout functionality
router.get("/logout", userController.logout);

module.exports = router;