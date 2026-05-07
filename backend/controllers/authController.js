const token = jwt.sign(
  { id: user._id },   // ✅ ALWAYS use "id"
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);