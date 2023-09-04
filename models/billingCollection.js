const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
    name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      //required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  //------------create billing model or collection/table--------------
  const BillingCollection = mongoose.model("BillingCollection", billingSchema);

module.exports = BillingCollection;
