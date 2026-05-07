const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/auth');

const {
  getProfile,
  updateProfile,
  changePassword,
  getUserStats,
  upload
} = require('../controllers/userController');


// ================= PROFILE =================

// 🔥 GET PROFILE
router.get('/profile', verifyToken, getProfile);


// 🔥 UPDATE PROFILE (with image upload)
router.put(
  '/profile',
  verifyToken,
  upload.single('photo'),
  updateProfile
);


// 🔐 CHANGE PASSWORD
router.post('/profile/password', verifyToken, changePassword);


// 📊 USER STATS (complaints count etc.)
router.get('/profile/stats', verifyToken, getUserStats);


// ================= LOGOUT (OPTIONAL) =================
// Note: JWT logout is handled on frontend (token removal)
router.post('/logout', verifyToken, (req, res) => {
  res.json({ message: "Logged out successfully (client should delete token)" });
});


module.exports = router;