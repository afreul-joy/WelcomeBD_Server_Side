const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  displayName: String,
  photoURL: String,
  rating: Number,
  comment: String,
});

const tourismSpotSchema = new mongoose.Schema({
  name: String,
  location: String,
  img: [String],
  map:String,
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
  tour_description: String,
  locations_covered: [String],
  menu_items: {
    Day_1: {
      Breakfast: String,
      Lunch: String,
      Dinner: String,
    },
    Day_2: {
      Breakfast: String,
      Lunch: String,
      Dinner: String,
    },
  },
  bookTour: String,
  pickUp: String,
  inclusion_exclusion: {
    inclusion: [String],
    exclusion: [String],
  },
  travelTips: [String],
  policy: {
    cancellation: String,
  },
});

const tourismSpotCollection = mongoose.model(
  "tourism_spots_collection",
  tourismSpotSchema
);

module.exports = tourismSpotCollection;
