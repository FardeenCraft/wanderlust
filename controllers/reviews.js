const Listing = require('../models/listing.js');
const Review = require('../models/review.js');



module.exports.createReview = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, 'Listing not found');
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id; // ✅ set the author to the current user
    listing.reviews.push(newReview);
    await newReview.save(); // ✅ added await
    await listing.save();
    req.flash('success', 'Review added successfully!');

    res.redirect(`/listings/${req.params.id}`);
    }

module.exports.destroyReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listings/${id}`);
    }