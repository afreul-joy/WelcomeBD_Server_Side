const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,

    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"], // Define possible roles (you can extend this list)
    default: "user", // Set the default role to "user"
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const userCollection = mongoose.model("users_collection", userSchema);

module.exports = userCollection;
