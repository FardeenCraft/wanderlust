const mongoose = require('mongoose');
const Review = require('./review.js');

const schema = mongoose.Schema;

// ✅ FLATTENED image schema
const imageSchema = new schema({
  url: String,
  filename: String,
});

const listingSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: imageSchema, // single image
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  owner: {
    type: schema.Types.ObjectId,
    ref: 'User',
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {  
      type: [Number],
      required: true,
    },
  },
});

// ✅ Middleware to delete reviews if listing is deleted
listingSchema.post('findOneAndDelete', async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
