const Listing = require('../models/listing.js');
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });





module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.randomNewForm= (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path:'reviews',populate:{path:'author',},}).populate("owner");
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings'); // added return
  }
  console.log(listing);
res.render("listings/show", { listing, currUser: req.user, MAP_TOKEN: process.env.MAP_TOKEN });
};

module.exports.createListing = async (req, res) => {

   let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location    ,
  limit: 1,
})
  .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // Associate the listing with the logged-in user
  newListing.image = { url, filename }; // Set the image field with the uploaded file details
  newListing.geometry = response.body.features[0].geometry; // Set the geometry field with the geocoding response
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash('success', 'Listing created successfully!');
  res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);


    let originalImage = listing.image.url;
   originalImage =  originalImage.replace("/upload",  "/upload/w_250");
  res.render('listings/edit', { listing , originalImage }); // Pass the listing object to the edit view
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
  if(typeof req.file!== 'undefined' ) {
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = { url, filename }; // Update the image field with the new file details
  await listing.save();
  } 
  req.flash('success', 'Listing updated successfully!');
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Listing deleted successfully!');
  res.redirect('/listings');
};