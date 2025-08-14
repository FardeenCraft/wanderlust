const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapasync.js");
const { isLoggedIn, isOwner,validateListing} = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage}); // Configure multer for file uploads


router.route('/')
    .get(wrapAsync(listingController.index)) // LIST all listings
    .post(isLoggedIn,upload.single('listing[image][url]'), validateListing, wrapAsync(listingController.createListing)); // CREATE new listing
    


     // FORM to create new listing
     router.get('/new', isLoggedIn,listingController.randomNewForm);


    router.route('/:id')
    .get(wrapAsync(listingController.showListing)) // SHOW listing by ID
    .put(isLoggedIn, isOwner,upload.single('listing[image][url]'),   validateListing, wrapAsync(listingController.updateListing)) // UPDATE a listing
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); // DELETE a listing


// EDIT form for a listing
router.get('/:id/edit', isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));





module.exports = router;
