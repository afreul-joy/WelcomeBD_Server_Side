const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  username: String,
  gender: String,
  userimg: String,
  rating: Number,
  comment: String,
});

const reviewCollection = mongoose.model("Review", reviewSchema);

module.exports = reviewCollection;
