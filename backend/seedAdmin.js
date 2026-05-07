const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cityconnect";

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin exists
    const adminExists = await User.findOne({ email: "admin@cityconnect.com" });
    
    if (adminExists) {
      console.log("Admin user already exists");
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = new User({
        name: "Admin",
        email: "admin@cityconnect.com",
        password: hashedPassword,
        role: "admin"
      });
      
      await admin.save();
      console.log("Admin user created successfully!");
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

seedAdmin();
