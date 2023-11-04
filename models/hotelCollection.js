const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  displayName: String,
  photoURL: String,
  rating: Number,
  comment: String,
});

const hotelSchema = new mongoose.Schema({
  name: String,
  location: String,
  img: String,
  originalPrice: Number,
  discountedPrice: Number,
  discountPercent: Number,
  hotel_description: String,
  rating: Number,
  map: String,
  policy: {
    checkIn: String,
    checkOut: String,
    petPolicy: String,
    houseRules: String,
    cancellation: String,
  },
  user_reviews: [reviewSchema],
  facilities: [String],
  room_details: {
    room_name: String,
    price: String,
    room_images: [String],
    room_description: String,
    room_inclusion: [String],
    room_facilities: [String],
  },
});

const hotelCollection = mongoose.model("hotel_collection", hotelSchema);

module.exports = hotelCollection;
