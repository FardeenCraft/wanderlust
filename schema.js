const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().min(0).required(),

    // ✅ Fix: image should be an object
    image: Joi.object({
      filename: Joi.string().allow('', null),
      url: Joi.string().uri().allow('', null)
    }).optional()

  }).required()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required()
    })
    .required()
});