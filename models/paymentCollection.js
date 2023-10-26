const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: Number,
  img:String,
  id: String,
  guide: String,
  email: String,
  journeyDate: Date,
  location: String,
  paymentStatus: String,
  status: String,
  locationID: String
});

const paymentCollection = mongoose.model("payment_collections", paymentSchema);

module.exports = paymentCollection;
