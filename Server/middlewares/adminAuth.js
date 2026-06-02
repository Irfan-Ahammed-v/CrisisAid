const jwt = require("jsonwebtoken");

exports.adminAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    req.adminId = decoded.id; // trusted admin id
    next(); // allow access
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
