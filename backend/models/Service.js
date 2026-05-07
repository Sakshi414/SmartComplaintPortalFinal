const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true
  },

  active: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Service", serviceSchema);
