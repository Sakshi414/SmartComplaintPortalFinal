const Complaint = require('../models/Complaint');


const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('userId', 'name email');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createComplaint = async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getComplaints, createComplaint, updateStatus };
await sendSMS(user.phone, "Your complaint has been submitted successfully.");