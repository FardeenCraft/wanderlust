const Listing = require('./models/listing'); // Adjust the path as necessary
const ExpressError = require('./utils/ExpressError.js'); // Adjust the path as necessary
const { listingSchema,reviewSchema } = require('./schema.js'); // Adjust the path as necessary
const Review = require('./models/review'); // Adjust the path as necessary



module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Save the URL the user was trying to access
    req.flash('error', 'You must be logged in to do that');
    return res.redirect('/login');
  }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
    let listing = await Listing.findById(id).populate('owner'); // Ensure owner is populated
  
    if (!listing.owner || !listing.owner._id.equals(req.user._id)) {
      req.flash('error', 'You are not authorized to do that');
      return res.redirect(`/listings/${id}`);
    }
  next();
  } 

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
    };

    module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash('error', 'Review not found.');
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You are not authorized to do that');
    return res.redirect(`/listings/${id}`);
  }

  next();
};


