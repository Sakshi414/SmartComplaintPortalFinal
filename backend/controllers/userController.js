const User = require('../models/User');
const Complaint = require('../models/Complaint');
const bcrypt = require('bcryptjs');
const multer = require('multer'); // Reuse config from complaint

// Multer config (reuse same as complaints)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// GET Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE Profile (multipart for photo)
const updateProfile = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      phone: req.body.phone,
      area: req.body.area,
      city: req.body.city,
      pincode: req.body.pincode,
      address: req.body.address
    };
    if (req.file) updates.photo = req.file.filename;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// CHANGE Password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET User Stats
const getUserStats = async (req, res) => {
  try {
    const match = { userId: req.user._id };
    const stats = await Complaint.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } }
        }
      }
    ]);
    res.json(stats[0] || { total: 0, pending: 0, resolved: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getUserStats,
  upload
};

