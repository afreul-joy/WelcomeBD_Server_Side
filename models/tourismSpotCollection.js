const mongoose = require("mongoose");

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
});

const tourismSpotCollection = mongoose.model("tourism_spots_collection", tourismSpotSchema);

module.exports = tourismSpotCollection;
