const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/admin/adminAuthController");

// Input validation helper
const validateInput = (data, fields) => {
  for (const field of fields) {
    if (!data[field] || data[field].trim() === "") {
      return { valid: false, message: `${field} is required` };
    }
  }
  return { valid: true };
};

// Register with validation
router.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  
  const validation = validateInput({ name, email, password }, ["name", "email", "password"]);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }
  
  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  
  // Password strength validation (min 6 chars)
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  
  next();
}, ctrl.adminRegister);

// Login with validation
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  
  const validation = validateInput({ email, password }, ["email", "password"]);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }
  
  next();
}, ctrl.adminLogin);

module.exports = router;
