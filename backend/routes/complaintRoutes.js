const express = require("express");
const router = express.Router();
const multer = require("multer");

const { verifyToken } = require("../middleware/auth");
const Complaint = require("../models/Complaint");

const upload = multer({ dest: "uploads/" });

// CREATE COMPLAINT (USER)
router.post("/file", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const complaint = await Complaint.create({
      category: req.body.category,
      area: req.body.area,
      description: req.body.description,
      file: req.file ? req.file.filename : null,
      userId: req.user._id,
      status: "Pending"
    });

    res.status(201).json({
      message: "Complaint submitted",
      complaintId: complaint._id
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// SIMPLE COMPLAINT
router.post("/simple", verifyToken, async (req, res) => {
  try {
    const complaint = await Complaint.create({
      title: req.body.title,
      description: req.body.description,
      userId: req.user._id,
      status: "Pending"
    });

    res.status(201).json({
      message: "Complaint submitted",
      complaintId: complaint._id
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// USER TRACK
router.get("/track/:id", verifyToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Not found" });
    }

    if (
      req.user.role !== "admin" &&
      complaint.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(complaint);

  } catch (err) {
    res.status(500).json({ message: "Invalid ID" });
  }
});

module.exports = router;