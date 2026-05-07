const express = require("express");
const router = express.Router();

const adminAuth = require("../../middleware/adminAuth");

const {
  getComplaints,
  updateStatus
} = require("../../controllers/admin/adminComplaintController");

// GET ALL COMPLAINTS
router.get("/", adminAuth, getComplaints);

// UPDATE STATUS
router.patch("/:id/status", adminAuth, updateStatus);

module.exports = router;