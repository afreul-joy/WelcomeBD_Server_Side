const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema({
//   id: Number,
  name: String,
  gender: String,
  img: String,
  location: String,
  languages: [String],
  rating: Number,
  details: String,
  charge: Number,
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

const guideCollection = mongoose.model("guide_collections", guideSchema);

module.exports = guideCollection;
