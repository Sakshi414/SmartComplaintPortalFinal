const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role: req.body.role || 'user' });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);  // Log actual error
    res.status(500).json({ message: err.message || "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message || "Login failed" });
  }
});

module.exports = router;
