const jwt = require("jsonwebtoken");

exports.centerAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.centerId = decoded.id; // trusted center id
    next(); // allow access
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
