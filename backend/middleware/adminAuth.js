const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

const user = await User.findById(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin only access" });
    }

    req.user = user;
    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
