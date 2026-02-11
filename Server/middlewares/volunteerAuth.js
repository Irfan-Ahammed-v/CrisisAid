const jwt = require("jsonwebtoken");

exports.volunteerAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ROLE CHECK
    if (decoded.role !== "volunteer") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.volunteerId = decoded.id; // trusted volunteer id
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

