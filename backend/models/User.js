const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  // 🔥 IMPORTANT FOR SMS
phone: {
    type: String,
    // required: true,  // Made optional for registration
    match: [/^\+\d{10,15}$/, "Please use valid phone format (+countrycode)"]
  },

  photo: String,
  area: String,
  city: String,
  pincode: String,
  address: String,

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);