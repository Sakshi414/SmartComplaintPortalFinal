const Service = require("../models/Service");

exports.getServices = async (req, res) => {
  const services = await Service.find();
  res.json(services);
};

exports.applyService = async (req, res) => {
  const service = new Service({ name: req.body.service });
  await service.save();
  res.json({ message: "Service applied successfully" });
};
