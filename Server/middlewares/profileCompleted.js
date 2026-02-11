const Centers = require("../models/centers");

exports.profileCompletedCheck = async (req, res, next) => {
  try {
    const center = await Centers.findById(req.centerId);

    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }

    if (!center.profileCompleted) {
      return res.status(403).json({
        message: "Complete profile before accessing this feature",
      });
    }

    next(); // ✅ profile completed
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
