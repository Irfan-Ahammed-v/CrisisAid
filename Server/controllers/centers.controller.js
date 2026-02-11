const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Centers = require("../models/centers");
exports.centerReg = async (req, res) => {
  try {
    const { district_id, center_email, center_password } = req.body;

    const exists = await Centers.findOne({
      district_id,
      center_email,
    });

    if (exists) {
      return res.status(409).json({
        message: "Center already exists in this district",
      });
    }

    const hashedPassword = await bcrypt.hash(center_password, 10);

    const center = new Centers({
      district_id,
      center_email,
      center_password: hashedPassword,
      profileCompleted: false,
    });

    await center.save();

    return res.status(201).json({
      message: "Center registered successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.home = async (req, res) => {
  try {
    const center = await Centers.findById(req.centerId);

    res.json({
      message: "Welcome Center",
      centerId: req.centerId,
      profileCompleted: center.profileCompleted, 
      center,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}


exports.completeCenterProfile = async (req, res) => {
  try {
    const centerId = req.centerId; 
    const { name, address, capacity } = req.body;

    await Centers.findByIdAndUpdate(centerId, {
      center_name: name,
      center_address: address,
      center_capacity: capacity,
      profileCompleted: true,
    });

    res.json({ message: "Profile completed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.centerLogout = (req, res) => {
  res.clearCookie("center_token", {
    httpOnly: true,
    sameSite: "strict",
    secure: false, // true in production (HTTPS)
  });

  res.json({ message: "Logged out successfully" });
};