const Complaint = require("../../models/Complaint");
const mongoose = require("mongoose");
const sendSMS = require("../../twilio");

const STATUS = ["Pending", "Verified", "Assigned", "Resolved"];

// ================= GET ALL =================
exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("userId");
    res.json(complaints);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};


// ================= UPDATE STATUS =================
exports.updateStatus = async (req, res) => {
  try {
    console.log("🔄 Update status request:", req.params.id, req.body);

    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid complaint ID" });
    }

    // ✅ Find complaint
    const complaint = await Complaint.findById(req.params.id).populate("userId");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // 🔥 Normalize status
    let newStatus = req.body.status;
    if (newStatus) {
      newStatus =
        newStatus.charAt(0).toUpperCase() +
        newStatus.slice(1).toLowerCase();
    }

    // 🔥 Validate status
    if (!STATUS.includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // 🔥 Prevent duplicate update
    if (complaint.status === newStatus) {
      return res.json({ message: "Status already updated", complaint });
    }

    // ✅ Update
    complaint.status = newStatus;
    await complaint.save();

    console.log("✅ Status updated to:", newStatus);

    // ================= MESSAGE =================
    let message = "";
    switch (newStatus) {
      case "Pending":
        message = "Your complaint has been submitted.";
        break;
      case "Verified":
        message = "Your complaint has been verified.";
        break;
      case "Assigned":
        message = "Work has been assigned to the department.";
        break;
      case "Resolved":
        message = "Your complaint has been resolved. Thank you!";
        break;
      default:
        message = `Status updated to ${newStatus}`;
    }

    // ================= SOCKET =================
    const io = req.app.get("io");
    if (io) {
      io.emit("statusUpdate", {
        complaintId: complaint._id.toString(),
        status: newStatus,
        message
      });
      console.log("📡 Socket emitted");
    }

    // ================= SMS =================
    try {
      if (complaint.userId?.phone) {
        console.log("📱 Sending SMS to:", complaint.userId.phone);

        await sendSMS(
          complaint.userId.phone,
          `Smart Complaint Portal Update: ${message}`
        );

        console.log("✅ SMS sent successfully");
      } else {
        console.log("⚠️ No phone number found for user");
      }
    } catch (smsError) {
      console.error("❌ SMS FAILED:", smsError.message);
    }

    // ================= RESPONSE =================
    res.json({
      message: "Status updated successfully",
      complaint
    });

  } catch (err) {
    console.error("❌ Update complaint ERROR:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};