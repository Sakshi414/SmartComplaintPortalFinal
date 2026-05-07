const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    category: { type: String, default: "General" },

    department: {
      type: String,
      enum: ["Water", "Roads", "Electricity", "Sanitation", "General"],
      default: "General"
    },

    area: String,

    description: {
      type: String,
      required: true
    },

    file: String,

    title: String,

    status: {
      type: String,
      enum: ["Pending", "Verified", "Assigned", "Resolved"],
      default: "Pending"
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);