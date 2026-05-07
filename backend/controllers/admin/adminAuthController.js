const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Admin Registration
exports.adminRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();

    res.status(201).json({ message: "Admin registered successfully", adminId: admin._id });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt for:", email);

  const admin = await User.findOne({ email, role: "admin" });

  if (!admin) {
    console.log("Admin not found");
    return res.status(400).json({ message: "Admin not found" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    console.log("Invalid password");
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: admin._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  console.log("Login successful for:", email);
  res.json({ token, admin });
};
