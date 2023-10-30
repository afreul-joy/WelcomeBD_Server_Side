const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  displayName: String,
  photoURL: String,
  rating: Number,
  comment: String,
});

const guideSchema = new mongoose.Schema({
  name: String,
  gender: String,
  img: String,
  location: String,
  availableLocations: [mongoose.Schema.Types.ObjectId], // Add this field
  languages: [String],
  rating: Number,
  details: String,
  charge: Number,
  user_reviews: [reviewSchema], 
});

const guideCollection = mongoose.model("guide_collections", guideSchema);

module.exports = guideCollection;
