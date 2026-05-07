const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded token:", decoded); // 🔥 DEBUG

const user = await User.findById(decoded.id); // FIXED: JWT uses { id }, not userId

    if (!user) {
      return res.status(401).json({
        message: "User not found in database"
      });
    }

    req.user = user;
    next();

  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyToken };