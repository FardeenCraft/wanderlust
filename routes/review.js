    const express = require('express');
    // ✅ mergeParams added
    const router = express.Router({ mergeParams: true });

    const wrapAsync = require("../utils/wrapasync.js");
    const ExpressError = require("../utils/ExpressError.js");
    const Listing = require('../models/listing.js');
    const Review = require('../models/review.js');
    const { validateReview, isReviewAuthor } = require('../middleware.js');
    const { isLoggedIn } = require('../middleware.js');
    const reviewsController = require('../controllers/reviews.js');

    

    // POST a new review
    router.post('/', isLoggedIn,validateReview, wrapAsync(reviewsController.createReview));

    // DELETE a review
    router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(reviewsController.destroyReview));

    module.exports = router;
