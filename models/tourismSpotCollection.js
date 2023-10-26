const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  displayName: String,
  photoURL: String,
  rating: Number,
  comment: String,
});

const tourismSpotSchema = new mongoose.Schema({
  location: String,
  img: [String],
  tour_duration: String,
  originalPrice: Number,
  discountedPrice: Number,
  discountPercent: Number,
  place_description: String,
  tour_details: String,
  packages: [String],
  categories: [String],
  rating: Number,
  user_reviews: [reviewSchema], // Nested reviews
});

const tourismSpotCollection = mongoose.model(
  "tourism_spots_collection",
  tourismSpotSchema
);

module.exports = tourismSpotCollection;
