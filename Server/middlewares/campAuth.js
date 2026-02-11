const jwt = require("jsonwebtoken");

exports.campAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "camp") {
      return res.status(403).json({ message: "Access denied" });
    }
    req.campId = decoded.id; // trusted camp id
    req.district_id = decoded.district_id;
    next(); // allow access
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
